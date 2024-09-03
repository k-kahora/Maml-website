import React, { useState } from 'react';

import AceEditor from 'react-ace';
import 'ace-builds/src-noconflict/mode-javascript';

import 'ace-builds/src-noconflict/theme-github';

import { QueryClient, QueryClientProvider, useQuery, useMutation } from 'react-query';
import axios from "axios";

const queryClient = new QueryClient()


// function GetData() {
//   const { isLoading, error, data } = useQuery('repoData', () =>
//     fetch('http://localhost:8000/things').then(res =>
//       res.json()
//     )
//   )

//   if (isLoading) return 'Loading...'

//   if (error) return 'An error has occurred: ' + error.message

//   return (
//       <h1>{data.hello}</h1>
//   )
// }

function SubmitButton({ onClick, isLoading }) {
  return (
    <button onClick={onClick} disabled={isLoading}>
      {isLoading ? 'Loading...' : 'Submit Code'}
    </button>
  );
}


function OutputBox({ output }) {
  return (
      <h1>{output}</h1>
  );
}

// This should return the posted data
function ExecuteCode({code, success, error}) {
 const mutation = useMutation(() => {
    return axios.post("http://localhost:8000/ocaml", {input:code});
  });  // const mutation = useMutation((newPost) =>
  //   axios.post("https://jsonplaceholder.typicode.com/posts", newPost),
  // );
    const handleSubmit = () => {
	mutation.mutate(null,{ // NOTE Why does null matter here
	    onSuccess: (data) => {
		success(data?.data?.result || 'No output');
	    },
	    onError: (error) => {
		error(`An error occurred: ${error.message}`);
	    }
	});
    };
    
    return <SubmitButton onClick={handleSubmit} isLoading={mutation.isLoading}/>

}

function Editor() {

    const [code, setCode] = useState('let x <- 64; x * 2');
    const [output, setOutput] = useState('output');
    function onChange(newValue) {
	setCode(newValue);
    }

    const handleSuccess = (output) => {
	setOutput(output);
    };

    const handleError = (error) => {
	setOutput(error);
    };

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
	<OutputBox output={output}/>
	<QueryClientProvider client={queryClient}>
	  <ExecuteCode success={handleSuccess} error={handleError} code={code}/>
        </QueryClientProvider>
	</>
    );
}

export default Editor;
