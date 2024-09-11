import React, { useState, useEffect, useMemo } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchLogs, deleteLogs, addCalculationLog } from '../store/calculatorSlice'; 
import './Calculator.css';
import SearchSharpIcon from '@mui/icons-material/SearchSharp';
import DeleteIcon from '@mui/icons-material/Delete';
import { useNavigate } from 'react-router-dom';

const CalculatorWithLog = () => {
    const [input, setInput] = useState('');
    const [selectAll, setSelectAll] = useState(false);
    const [selectedLogs, setSelectedLogs] = useState({});
    const [searchID, setSearchID] = useState('');
    const [searchExpression, setSearchExpression] = useState('');
    const [searchIsValid, setSearchIsValid] = useState('');
    const [searchOutput, setSearchOutput] = useState('');
    const [searchCreatedOn, setSearchCreatedOn] = useState('');
    const [searchVisible, setSearchVisible] = useState({
        id: false,
        expression: false,
        isValid: false,
        output: false,
        createdOn: false
    });
    const [page, setPage] = useState(1);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const { logs, totalPages } = useSelector((state) => state.calculator);
    const { token } = useSelector((state) => state.auth);

    useEffect(() => {
        if (!token) {
            navigate('/signin');
        } else {
            dispatch(fetchLogs({ page }));
        }
    }, [dispatch, page, token, navigate]);

    const handleClick = (value) => {
        setInput((prevInput) => prevInput + value);
    };

    const clearInput = () => {
        setInput('');
    };

    const deleteLast = () => {
        setInput((prevInput) => prevInput.slice(0, -1));
    };

    const calculateResult = async () => {
        try {
            const result = eval(input); // Be cautious with eval in production!
            const logEntry = {
                expression: input,
                is_valid: true,
                output: result.toString(),
            };
            await dispatch(addCalculationLog(logEntry));
            dispatch(fetchLogs({ page }));
            setInput(result.toString());
        } catch (error) {
            const logEntry = {
                expression: input,
                is_valid: false,
                output: 'error',
            };
            await dispatch(addCalculationLog(logEntry));
            dispatch(fetchLogs({ page }));
            setInput('error');
        }
    };

    const handleSelectAll = (event) => {
        const isChecked = event.target.checked;
        setSelectAll(isChecked);
        setSelectedLogs(() => {
            const newSelectedLogs = {};
            logs.forEach(log => {
                if (log && log._id) {
                    newSelectedLogs[log._id] = isChecked;
                }
            });
            return newSelectedLogs;
        });
    };

    const handleRowCheckboxChange = (event, id) => {
        const isChecked = event.target.checked;
        setSelectedLogs(prev => ({
            ...prev,
            [id]: isChecked,
        }));
    };

    const handleSearchIconClick = (field) => {
        setSearchVisible(prev => ({
            ...prev,
            [field]: !prev[field],
        }));
    };

    const deleteSelectedLogs = async () => {
        const idsToDelete = Object.keys(selectedLogs).filter(id => selectedLogs[id]);
        if (idsToDelete.length === 0) return;

        try {
            await dispatch(deleteLogs({ ids: idsToDelete }));
            dispatch(fetchLogs({ page }));
            setSelectedLogs({});
        } catch (error) {
            console.error('Failed to delete logs:', error);
        }
    };

    const filteredLogs = useMemo(() => {
        return logs
            .filter(log => log && log._id)  // Ensure each log and _id exist
            .filter(log => {
                const idMatch = log._id.toString().toLowerCase().includes(searchID.toLowerCase());
                const expressionMatch = log.expression && log.expression.toLowerCase().includes(searchExpression.toLowerCase());
                const isValidMatch = searchIsValid === '' || (log.is_valid ? 'true' : 'false').includes(searchIsValid.toLowerCase());
                const outputMatch = log.output ? log.output.toString().toLowerCase().includes(searchOutput.toLowerCase()) : '';
                const createdOnMatch = log.created_on ? new Date(log.created_on).toLocaleString().toLowerCase().includes(searchCreatedOn.toLowerCase()) : '';

                return idMatch && expressionMatch && isValidMatch && outputMatch && createdOnMatch;
            });
    }, [logs, searchID, searchExpression, searchIsValid, searchOutput, searchCreatedOn]);

    return (
        <div className="calculator-log-container">
            {token ? (
                <>
                    <div className="calculator">
                        <div className="display">
                            <input type="text" value={input} readOnly />
                        </div>
                        <div className="button">
                            <button onClick={clearInput}>AC</button>
                            <button onClick={deleteLast}>DEL</button>
                            <button onClick={() => handleClick('%')}>%</button>
                            <button onClick={() => handleClick('/')}>/</button>
                            <button onClick={() => handleClick('7')}>7</button>
                            <button onClick={() => handleClick('8')}>8</button>
                            <button onClick={() => handleClick('9')}>9</button>
                            <button onClick={() => handleClick('*')}>*</button>
                            <button onClick={() => handleClick('4')}>4</button>
                            <button onClick={() => handleClick('5')}>5</button>
                            <button onClick={() => handleClick('6')}>6</button>
                            <button onClick={() => handleClick('-')}>-</button>
                            <button onClick={() => handleClick('1')}>1</button>
                            <button onClick={() => handleClick('2')}>2</button>
                            <button onClick={() => handleClick('3')}>3</button>
                            <button onClick={() => handleClick('+')}>+</button>
                            <button onClick={() => handleClick('00')}>00</button>
                            <button onClick={() => handleClick('0')}>0</button>
                            <button onClick={() => handleClick('.')}>.</button>
                            <button className="eg" onClick={calculateResult}>=</button>
                        </div>
                    </div>
                    <div className="log-table-container">
                        <button className="delete-button" onClick={deleteSelectedLogs} disabled={Object.values(selectedLogs).every(val => !val)}>
                            <DeleteIcon /> Delete Selected
                        </button>
                        <table className="log-table">
                            <thead>
                                <tr>
                                    <th>
                                        <input
                                            type="checkbox"
                                            checked={selectAll}
                                            onChange={handleSelectAll}
                                        />
                                    </th>
                                    <th>
                                        ID
                                        <SearchSharpIcon onClick={() => handleSearchIconClick('id')} />
                                        {searchVisible.id && (
                                            <input
                                                type="text"
                                                placeholder="Search ID..."
                                                value={searchID}
                                                onChange={(e) => setSearchID(e.target.value)}
                                            />
                                        )}
                                    </th>
                                    <th>
                                        Expression
                                        <SearchSharpIcon onClick={() => handleSearchIconClick('expression')} />
                                        {searchVisible.expression && (
                                            <input
                                                type="text"
                                                placeholder="Search Expression..."
                                                value={searchExpression}
                                                onChange={(e) => setSearchExpression(e.target.value)}
                                            />
                                        )}
                                    </th>
                                    <th>
                                        Is Valid
                                        <SearchSharpIcon onClick={() => handleSearchIconClick('isValid')} />
                                        {searchVisible.isValid && (
                                            <input
                                                type="text"
                                                placeholder="Search Is Valid..."
                                                value={searchIsValid}
                                                onChange={(e) => setSearchIsValid(e.target.value)}
                                            />
                                        )}
                                    </th>
                                    <th>
                                        Output
                                        <SearchSharpIcon onClick={() => handleSearchIconClick('output')} />
                                        {searchVisible.output && (
                                            <input
                                                type="text"
                                                placeholder="Search Output..."
                                                value={searchOutput}
                                                onChange={(e) => setSearchOutput(e.target.value)}
                                            />
                                        )}
                                    </th>
                                    <th>
                                        Created On
                                        <SearchSharpIcon onClick={() => handleSearchIconClick('createdOn')} />
                                        {searchVisible.createdOn && (
                                            <input
                                                type="text"
                                                placeholder="Search Created On..."
                                                value={searchCreatedOn}
                                                onChange={(e) => setSearchCreatedOn(e.target.value)}
                                            />
                                        )}
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredLogs.map(log => (
                                    <tr key={log._id}>
                                        <td>
                                            <input
                                                type="checkbox"
                                                checked={selectedLogs[log._id] || false}
                                                onChange={(e) => handleRowCheckboxChange(e, log._id)}
                                            />
                                        </td>
                                        <td>{log._id}</td>
                                        <td>{log.expression}</td>
                                        <td>{log.is_valid ? 'True' : 'False'}</td>
                                        <td>{log.output}</td>
                                        <td>{new Date(log.created_on).toLocaleString()}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    <div className="pagination">
                        {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
                            <button
                                key={p}
                                className={page === p ? 'active' : ''}
                                onClick={() => setPage(p)}
                            >
                                {p}
                            </button>
                        ))}
                    </div>
                </>
            ) : (
                <div>Please sign in to access the calculator.</div>
            )}
        </div>
    );
};

export default CalculatorWithLog;



