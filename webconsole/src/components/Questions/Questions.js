import React, { useState, useEffect } from 'react';
import SideBar from '../Utils/SideBar';
import Alert from '@mui/material/Alert';
import CheckIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';
import DialogComponent from '../Utils/Dialog';
import { Button, FormControl, InputLabel, MenuItem, Paper, Select, TextField } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import { useLocation } from 'react-router-dom';
import SearchBar from '../Utils/SearchBar';
import { MdDeleteOutline } from 'react-icons/md';
import NewQuestion from './NewQuestion';
import './Questions.css';

const Questions = (props) => {
    const location = useLocation();
    const paginationModel = { page: 0, pageSize: 15 };

    const [questions, setQuestions] = useState([]);
    const [allQuestions, setAllQuestions] = useState([]);
    const [allDiseases, setAllDiseases] = useState([]);
    const [editQuestion, setEditQuestion] = useState(null);
    const [editedValue, setEditedValue] = useState("");
    const [newQuestion, setNewQuestion] = useState({});
    const [newQuesAnswerCount, setNewQuesAnswerCount] = useState(0)
    const [dialogDelete, setDialogDelete] = useState({ open: false, message: '' });
    const [dialogView, setDialogView] = useState(null);
    const [viewOptions, setViewOptions] = useState(null);
    // const [dialog, setDialog] = useState({ open: false, message: '' });
    const [dialogQues, setDialogQues] = useState({ open: false, message: '' })
    const [dialogDisease, setDialogDisease] = useState({ open: false, message: '' })
    const [alert, setAlert] = useState({ show: false, message: '', type: '' });
    const [answerComponents, setAnswerComponents] = useState({})
    useEffect(() => {
        const pathSplits = location.pathname.split('/')
        const questionType = pathSplits[pathSplits.length - 1]
        getAllQuestionsAndDiseases(questionType);
    }, [location]);


    const getDiseases = (data, questionType) => {
        const diseaseMap = new Map();

        data.forEach(question => {
            question.diseases.forEach(disease => {
                if (!diseaseMap.has(disease.disease_id)) {
                    diseaseMap.set(disease.disease_id, disease.disease_name);
                }
            });
        });
        if (questionType.includes('daily')) {
            setAllDiseases(Array.from(diseaseMap).filter(([id, name]) => name === 'daily').map(([id, name]) => ({ disease_id: id, disease_name: name })));
            console.log(allDiseases)
        }
        else {
            setAllDiseases(Array.from(diseaseMap).filter(([id, name]) => name !== 'daily').map(([id, name]) => ({ disease_id: id, disease_name: name })));
        }
    };

    const getAllQuestionsAndDiseases = async (questionsType) => {
        try {
            const response = await fetch('http://localhost:3030/getQuestionsWithDetails', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (response.ok) {
                const data = await response.json();
                const questions = data.filter(question => {
                    const diseases = question.diseases;
                    if (!questionsType.includes('daily')) {
                        return diseases.length > 1 || !diseases.every(disease => disease.disease_name === 'daily');
                    }
                    return diseases.some(disease => disease.disease_name === 'daily');
                });
                setQuestions(questions);
                setAllQuestions(questions);
                getDiseases(questions, questionsType);
            } else {
                setAlert({ show: true, message: "Failed to get all questions", type: "error" });
            }
        } catch (error) {
            console.log(error)
            setAlert({ show: true, message: "Error fetching all questions", type: "error" });
        }
    };

    const handleDiseaseChange = (e) => {
        const updatedQuestions = e.target.value === 'ALL' ? allQuestions : allQuestions.filter(question =>
            question.diseases.some(disease => disease.disease_id === e.target.value));
        setQuestions(updatedQuestions);
    }

    const handleSearch = (e) => {
        const updatedQuestions = allQuestions.filter(question =>
            question.question.includes(e.target.value));
        setQuestions(updatedQuestions);
    }
    const deleteQuestion = async (id) => {
        try {
            const response = await fetch(`http://localhost:3030/deleteQuestion/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (response.ok) {
                const updatedQuestions = questions.filter(question => question.question_id !== id);
                setQuestions(updatedQuestions);
                setAlert({ show: true, message: "Question deleted successfully!", type: "success" });
            } else {
                setAlert({ show: true, message: "Failed to delete question", type: "error" });
            }
        } catch (error) {
            console.error("Error revoking user:", error);
            setAlert({ show: true, message: "Error in deleting question", type: "error" });
        }
    }

    const handleDelete = (question) => {
        setDialogDelete({ open: true, message: `Are you sure you want to delete "${question.question}" question?`, data: question.question_id });
    };

    const handleCancelDelete = () => {
        setDialogDelete({ open: false, message: "" });
    };

    const handleEdit = (question) => {
        setEditQuestion(question);
        setEditedValue(question.question);
    };

    const handleInputChange = (e) => {
        setEditedValue(e.target.value);
    };

    const saveEdit = () => {
        if (editQuestion) {
            //   saveQuestion({ ...editQuestion, question: editedValue }); // Send the updated question to the API
            const updatedQuestions = questions.map(q => q.question_id === editQuestion.question_id ? { ...editQuestion, question: editedValue } : q);
            setQuestions(updatedQuestions);
            setEditQuestion(null);
        }
    };

    const handleView = (question) => {
        setDialogView(question);
        const initialWeights = {};
        question.diseases.forEach(disease => {
            disease.options.forEach(option => {
                initialWeights[`${disease.disease_id}-${option.options_id}`] = option.weightage;
            });
        });
        console.log(initialWeights)
        setViewOptions(initialWeights)
    };

    // const handleAdd = () => {
    //     setDialog({ open: true, message: `Add possible answers to "${editedValue}" question`, data: 'addOptions' });
    // };

    const updateWeight = (diseaseId, optionId, newWeight) => {
        setViewOptions(prevWeights => ({
            ...prevWeights,
            [`${diseaseId}-${optionId}`]: newWeight
        }));
    };
    const handleCancelWeights = () => {
        setDialogView(null);
        setAnswerComponents({});
    }
    const handleCancelAddQues = () => {
        setDialogQues({ open: false, message: '' });
        setNewQuestion(null);
        setAnswerComponents({});
    }
    const handleAddQuestion = async () => {
        console.log({ ...newQuestion, status: 'active' });
        try {
            const response = await fetch(`http://localhost:3030/addQuestion/`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(newQuestion)
            });

            if (response.ok) {
                setAlert({ show: true, message: "Question added successfully!", type: "success" });
            } else {
                setAlert({ show: true, message: "Failed to add questions", type: "error" });
            }
        } catch (error) {
            console.error("Error adding questions:", error);
            setAlert({ show: true, message: "Error in adding questions", type: "error" });
        }
        setDialogQues({ open: false, message: '' });
        setAnswerComponents([])
        setNewQuestion(null);
    }
    const saveWeightChanges = async (question) => {
        // api
        const x = Object.keys(viewOptions)[0].split('-');
        const requestBody = {
            "question_id": question.question_id,
            "disease_id": x[0],
            "options_id": x[1],
            "weightage": viewOptions[`${x[0]}-${x[1]}`]
        }
        console.log('request body', requestBody)
        try {
            const response = await fetch(`http://localhost:3030/editOption/`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(requestBody)
            });

            if (response.ok) {
                setAlert({ show: true, message: "Answers updated successfully!", type: "success" });
            } else {
                setAlert({ show: true, message: "Failed to update answers", type: "error" });
            }
        } catch (error) {
            console.error("Error revoking user:", error);
            setAlert({ show: true, message: "Error in update answers", type: "error" });
        }
        setDialogView(null); // Close the dialog after saving
    };
    // const handleOnClickNewAnswer = (e) => {
    //     e.preventDefault();
    //     console.log(e, answerComponents)
    //     setAnswerComponents(prevComponents => [
    //         ...prevComponents,
    //         {
    //             id: newQuesAnswerCount,
    //             disease_id: e.target.name,
    //             component: (
    //                 <div style={{ display: 'flex', alignItems: 'center', marginLeft: '1rem' }} key={newQuesAnswerCount}>
    //                     <div style={{ textAlign: 'left', width: '50%' }}>
    //                         <input
    //                             className="form-control"
    //                             type="textarea"
    //                             id={`answer-${newQuesAnswerCount}`}
    //                             name={newQuesAnswerCount.toString()}
    //                             onChange={handleNewQuesInput}
    //                         />
    //                     </div>
    //                     <span style={{ margin: '0 1rem' }}>:</span>
    //                     <div style={{ textAlign: 'left', width: '50%' }}>
    //                         <input
    //                             className='answers-input'
    //                             type="number"
    //                             id={`answer-${newQuesAnswerCount}-weight`}
    //                             name={`answer-${newQuesAnswerCount}-weight`}
    //                             onChange={handleNewQuesInput}
    //                         />
    //                     </div>
    //                     <Button variant="contained" size="medium" sx={{ marginLeft: 3, fontSize: "large" }} onClick={() => handleCancelNewAnswer(newQuesAnswerCount)}>
    //                         <MdDeleteOutline />
    //                     </Button>
    //                 </div>
    //             )
    //         }
    //     ]);
    // };

    // const handleCancelNewAnswer = (id) => {
    //     setNewQuesAnswerCount(prevCount => prevCount - 1);
    //     setAnswerComponents(prevComponents => prevComponents.filter(component => component.id !== id));
    // };

    const handleOnClickNewAnswer = (e, diseaseId) => {
        e.preventDefault();
        const id = Date.now();
        console.log(diseaseId, answerComponents)
        setAnswerComponents(prevComponents => ({
            ...prevComponents,
            [diseaseId]: [
                ...(prevComponents[diseaseId] || []),
                {
                    id: id, // Unique ID for each answer
                    component: (
                        <div style={{ display: 'flex', alignItems: 'center', marginLeft: '1rem' }} key={Date.now()}>
                            <div style={{ textAlign: 'left', width: '50%' }}>
                                <label style={{ marginLeft: '0.5rem' }} htmlFor={`answer-${diseaseId}`}>
                                    New Answer
                                </label>
                                <input
                                    className="form-control"
                                    type="textarea"
                                    id={`answer-${diseaseId}`}
                                    name={`answer-${diseaseId}`}
                                    onChange={(e) => handleNewQuesInput(e, diseaseId)}
                                />
                            </div>
                            <span style={{ margin: '0 1rem' }}>:</span>
                            <div style={{ textAlign: 'left', width: '50%' }}>
                                <label style={{ marginLeft: '0.5rem' }} htmlFor={`answer-${diseaseId}-weight`}>
                                    Weight
                                </label>
                                <input
                                    className='answers-input'
                                    type="number"
                                    id={`answer-${diseaseId}-weight`}
                                />
                            </div>
                            <Button variant="contained" size="medium" sx={{ marginLeft: 3, fontSize: "large" }} onClick={() => handleCancelNewAnswer(diseaseId, id)}>
                                <MdDeleteOutline />
                            </Button>
                        </div>
                    )
                }
            ]
        }));
    };

    const handleCancelNewAnswer = (diseaseId, answerId) => {
        console.log(diseaseId, answerId, answerComponents)
        setAnswerComponents(prevComponents => ({
            ...prevComponents,
            [diseaseId]: prevComponents[diseaseId].filter(answer => answer.id !== answerId)
        }));
    };
    const handleNewQuesInput = (e) => {
        switch (e.target.name) {
            case "questionDesc":
                setNewQuestion({ ...newQuestion, question: e.target.value })
                break;
            case "diseaseName":
                // change logic to disease id
                setNewQuestion({ ...newQuestion, diseases: e.target.value })
                break;
            case "questionType":
                setNewQuestion({ ...newQuestion, question_type: e.target.value })
                break;
        }

        console.log(e, newQuestion)
    }
    const columns: GridColDef[] = [
        {
            field: 'question',
            headerName: 'Questions',
            sortable: false,
            flex: 2,
            renderCell: (question) => {
                return editQuestion && editQuestion.question_id === question.id ?
                    <div className='edit-question'>
                        <input className='input-question' type="text" id="question"
                            name="question" value={editedValue}
                            onChange={handleInputChange} />
                        <button type="cancel" className="question-btn-cancel" onClick={() => setEditQuestion(null)}><CloseIcon fontSize="inherit" /></button>
                        <button type="submit" className="question-btn-submit" onClick={saveEdit}><CheckIcon fontSize="inherit" /></button>
                    </div> : question.question
            },
        },
        {
            field: 'disease',
            headerName: 'Diseases',
            sortable: false,
            flex: 1.1,
            valueGetter: (value, row) => {
                const diseaseNames = row.diseases.map(disease => disease.disease_name);
                return diseaseNames.join(', ');
            },
            renderCell: (row) => {
                return row.row.diseases.map(disease => disease.disease_name).join(', ');
            }
        },
        {
            field: 'answers',
            headerName: 'Answers',
            sortable: false,
            flex: 0.3,
            renderCell: (question) => {
                return <a
                    style={{ textDecoration: "underline", cursor: "pointer" }}
                    onClick={() => handleView(question.row)}
                >
                    View
                </a>
            },
        },
        { field: 'action', headerName: 'Action', flex: 0.3, renderCell: (question) => <a style={{ color: "green", cursor: "pointer" }} onClick={() => handleEdit(question.row)}>Edit</a> },
        { field: 'delete', headerName: 'Delete', flex: 0.3, renderCell: (question) => <a style={{ color: "red", cursor: "pointer" }} onClick={() => handleDelete(question.row)}>Delete</a> },
    ];

    const rows = questions.map(q => {
        q.id = q.question_id;
        return q;
    });
    return (
        <div className="user-content">
            <SideBar access="true" tab={props.tab} />
            <div className="user-main-content">
                {alert.show && <Alert variant="outlined" onClose={() => setAlert({ show: false })} severity={alert.type}>
                    {alert.message}
                </Alert>}
                {dialogDelete.open && <DialogComponent openDialog={dialogDelete.open} alertMessage={dialogDelete.message} data={dialogDelete.data} no={"No"} yes={"Yes"} action={deleteQuestion} cancel={handleCancelDelete} />}
                <div className='question-filters'>
                    <FormControl variant="standard" sx={{ m: 0, minWidth: 120 }}>
                        <InputLabel id="demo-simple-select-standard-label">Disease</InputLabel>
                        <Select
                            labelId="demo-simple-select-standard-label"
                            id="demo-simple-select-standard"
                            onChange={handleDiseaseChange}
                            label="Age"
                        >
                            <MenuItem key="all" value="ALL">
                                <em>All</em>
                            </MenuItem>
                            {/* disease change to disease id */}
                            {allDiseases.map(disease => <MenuItem key={disease.disease_id} value={disease.disease_name}>{disease.disease_name}</MenuItem>)}
                        </Select>
                    </FormControl>
                    <span className='question-search'>
                        <button className="menu-btn" onClick={() => setDialogQues({ open: true, message: `Add a new Question` })}>Add Question</button>
                        {!props.isDaily && <button className="menu-btn" onClick={() => setDialogDisease({ open: true, message: `Add Disease` })}>Add Disease</button>}
                        <SearchBar onChange={handleSearch} />
                    </span>
                </div>
                {dialogView && (
                    <DialogComponent openDialog={dialogView !== null} alertMessage={`Answers for Question "${dialogView.question}" with different diseases`} data={dialogView} no={"Cancel"} yes={"Save"} action={saveWeightChanges} cancel={handleCancelWeights}>
                        {/* <div className="popup-content">
                            {dialogView.diseases.map(disease => (
                                <div key={disease.disease_id} className='disease-section'>
                                    <h3>{disease.disease_name} <button name={disease.disease_id} onClick={handleOnClickNewAnswer}>Add Answer</button></h3>
                                    {disease.options.map(option => (
                                        <div key={option.options_id} className='question-filters'>
                                            <label className='full-width' style={{ display: 'flex' }}>
                                                <div style={{ margin: '1rem', width: '60%' }}>{option.option_text.toUpperCase()} :</div>
                                                <input
                                                    className='answers-input'
                                                    type="number"
                                                    value={viewOptions[`${disease.disease_id}-${option.options_id}`]}
                                                    onChange={(e) => updateWeight(disease.disease_id, option.options_id, parseInt(e.target.value))}
                                                />
                                            </label>
                                        </div>
                                    ))}
                                    <div>
                                        {answerComponents.filter(comp => comp.disease_id !== disease.disease_id).map(comp => comp.component)}
                                    </div>
                                </div>
                            ))}
                        </div> */}
                        <div className="popup-content">
                            {dialogView.diseases.map(disease => (
                                <div key={disease.disease_id} className='disease-section'>
                                    <h3>{disease.disease_name}
                                        <button name={disease.disease_id} onClick={(e) => handleOnClickNewAnswer(e, disease.disease_id)}>Add Answer</button>
                                    </h3>
                                    {disease.options.map(option => (
                                        <div key={option.options_id} className='question-filters'>
                                            <label className='full-width' style={{ display: 'flex' }}>
                                                <div style={{ margin: '1rem', width: '60%' }}>{option.option_text.toUpperCase()} :</div>
                                                <input
                                                    className='answers-input'
                                                    type="number"
                                                    value={viewOptions[`${disease.disease_id}-${option.options_id}`]}
                                                    onChange={(e) => updateWeight(disease.disease_id, option.options_id, parseInt(e.target.value))}
                                                />
                                            </label>
                                        </div>
                                    ))}
                                    <div>
                                        {(answerComponents[disease.disease_id] || []).map(answer => (
                                            <React.Fragment key={answer.id}>
                                                {answer.component}
                                            </React.Fragment>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>

                    </DialogComponent>
                )}
                {dialogQues.open && (
                    <DialogComponent openDialog={dialogQues.open} alertMessage={dialogQues.message} data={dialogQues} no={"Cancel"} yes={"Add"} action={handleAddQuestion} cancel={handleCancelAddQues}>
                        <NewQuestion allDiseases={allDiseases} newQuestion={newQuestion} handleNewQuesInput={handleNewQuesInput}
                            handleOnClickNewAnswer={(e, disease_id) => handleOnClickNewAnswer(e, disease_id)} answerComponents={answerComponents}></NewQuestion>
                    </DialogComponent>
                )}
                {dialogDisease.open && (
                    <DialogComponent openDialog={dialogDisease} alertMessage={`Add a new diseases`} data={dialogView} no={"Cancel"} yes={"Save"} action={saveWeightChanges} cancel={handleCancelWeights}>
                        <div className="popup-content">
                            <form className='profile-form'>
                                <div style={{ textAlign: "left" }}>
                                    <label htmlFor="lastName">Disease Name</label>
                                    <input type="text" id="diseaseName" name="diseaseName" />
                                </div>
                            </form>
                        </div>
                    </DialogComponent>
                )}
                <Paper sx={{ height: 700, width: '100%' }}>
                    <DataGrid
                        rows={rows}
                        columns={columns}
                        initialState={{ pagination: { paginationModel } }}
                        pageSizeOptions={[15, 20, 25]}
                        sx={{ border: 0 }}
                    />
                </Paper>
            </div>
        </div>
    );
};

export default Questions;
