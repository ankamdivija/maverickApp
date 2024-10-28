import * as React from 'react';
import { FormControl, InputLabel, MenuItem, Select } from '@mui/material';

const NewQuestion = (props) => {
    return <div className="popup-content">
        <form className='profile-form'>
            <div style={{ textAlign: "left" }}>
                <label htmlFor="resourceName">Question<span style={{ color: 'red' }}>*</span></label>
                <textarea className="form-control" type="textarea" id="questionDesc" name="questionDesc" onChange={props.handleNewQuesInput} />
            </div>
            <div style={{ textAlign: "left", display: 'flex' }}>
                <FormControl variant="standard" sx={{ m: 1.5, minWidth: '45%' }}>
                    <InputLabel id="demo-simple-select-standard-label">Question Type<span style={{ color: 'red' }}>*</span></InputLabel>
                    <Select
                        labelId="demo-simple-select-standard-label"
                        id="demo-simple-select-standard"
                        label="Age"
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
                        value={props.newQuestion && props.newQuestion.diseases ? props.newQuestion.diseases : []}
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
            <div>
                {(props.answerComponents[0] || []).map(comp => (
                    <React.Fragment key={comp.id}>
                        {comp.component}
                    </React.Fragment>
                ))}
            </div>
            <div style={{ textAlign: "left" }} >
                <button name="newQ" onClick={(e) => props.handleOnClickNewAnswer(e, 0)}>Add Answer</button>
            </div>
        </form>
    </div>;
}

export default NewQuestion;