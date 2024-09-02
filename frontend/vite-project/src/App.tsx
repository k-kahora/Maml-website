import React, { useState } from 'react';

import AceEditor from 'react-ace';
import 'ace-builds/src-noconflict/mode-javascript';

import 'ace-builds/src-noconflict/theme-github';

import { useQuery } from "react-query"; // NOTE what the hell is axios and react query
import axios from "axios";

function SubmitCode({code}) {
    function onClick() {
	console.log(code)
    }
    return <button onClick={onClick} className="submit">Submit</button>
}

function MyEditorComponent() {

    const [code, setCode] = useState('let x <- 64; x * 2');
    function onChange(newValue) {
	console.log('change', newValue);
    }
    function onChange(newValue) {
	setCode(newValue);
    }
    
    return (
	<>
	<AceEditor
	    mode="javascript"
	    theme="github"
	    onChange={onChange}
	    name="editior"
	    editorProps={{ $blockScrolling: true }}
	    fontSize={14}
	    showPrintMargin={true}
	    showGutter={true}
	    highlightActiveLine={true}
	    value={code}
	    setOptions={{
		enableBasicAutocompletion: false,
		enableLiveAutocompletion: false,
		enableSnippets: false,
		showLineNumbers: true,
		tabSize: 2,
	    }}
	/>
	<SubmitCode code={code}/>
	</>
    );
}

export default MyEditorComponent;
