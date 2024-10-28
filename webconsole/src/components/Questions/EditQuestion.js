import * as React from 'react';
import { FormControl, InputLabel, MenuItem, Select } from '@mui/material';

const EditQuestion = (props) => {
    const [viewOptions, setViewOptions] = React.useState({});
    React.useEffect(() => {
        handleView(props.data);
    }, []);
    const handleView = (question) => {
        console.log(props)
        const initialWeights = {};
        question.diseases.forEach(disease => {
            disease.options.forEach(option => {
                initialWeights[`${disease.disease_id}-${option.options_id}`] = option.weightage;
            });
        });
        console.log(initialWeights)
        setViewOptions(initialWeights)
    };

    const updateWeight = (diseaseId, optionId, newWeight) => {
        setViewOptions(prevWeights => ({
            ...prevWeights,
            [`${diseaseId}-${optionId}`]: newWeight
        }));
    };
    return <div className="popup-content">
        <form className='profile-form'>
            <div style={{ textAlign: "left" }}>
                <label htmlFor="resourceName">Question<span style={{ color: 'red' }}>*</span></label>
                <textarea className="form-control" type="textarea" id="questionDesc" name="questionDesc" value={props.data.question} onChange={props.handleNewQuesInput} />
            </div>
            <div style={{ textAlign: "left", display: 'flex' }}>
                <FormControl variant="standard" sx={{ m: 1.5, minWidth: '45%' }}>
                    <InputLabel id="demo-simple-select-standard-label">Question Type<span style={{ color: 'red' }}>*</span></InputLabel>
                    <Select
                        labelId="demo-simple-select-standard-label"
                        id="demo-simple-select-standard"
                        label="Age"
                        value={props.data.question_type}
                        name="questionType"
                        onChange={props.handleNewQuesInput}
                    >
                        <MenuItem key="single_choice" value="single_choice">
                            Single Correct
                        </MenuItem>
                    </Select>
                </FormControl>
                <FormControl variant="standard" sx={{ m: 1.5, minWidth: '45%' }}>
                    <InputLabel id="demo-multiple-select-label">Disease<span style={{ color: 'red' }}>*</span></InputLabel>
                    <Select
                        labelId="demo-multiple-select-label"
                        id="demo-multiple-select"
                        name="diseaseName"
                        multiple // Enable multiple select
                        value={props.data && props.data.diseases ? props.data.diseases.map(d => d.disease_name) : []}
                        onChange={props.handleNewQuesInput}
                        renderValue={(selected) => selected.join(', ')} // Display selected values as a comma-separated string
                    >
                        <MenuItem key="0" value="ALL">
                            <em>All</em>
                        </MenuItem>
                        {/* disease change to disease id */}
                        {props.allDiseases.map((disease) => (
                            <MenuItem key={disease.disease_id} value={disease.disease_name}>
                                {disease.disease_name}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>
            </div>
            {props.data.diseases.map(disease => (
                <div key={disease.disease_id} className='disease-section' style={{ textAlign: 'left', marginLeft: '0' }}>
                    <h3>{disease.disease_name}
                        <button style={{ marginLeft: '1rem' }} name={disease.disease_id} onClick={(e) => props.handleOnClickNewAnswer(e, disease.disease_id)}>Add Answer</button>
                    </h3>
                    {disease.options.map(option => (
                        <div key={option.options_id} className='question-filters'>
                            <label className='full-width' style={{ display: 'flex' }}>
                                <div style={{ margin: '0.5rem', width: '60%' }}>{option.option_text.toUpperCase()} :</div>
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
                        {(props.answerComponents[disease.disease_id] || []).map(answer => (
                            <React.Fragment key={answer.id}>
                                {answer.component}
                            </React.Fragment>
                        ))}
                    </div>
                </div>
            ))}
        </form>
    </div>;
}

export default EditQuestion;