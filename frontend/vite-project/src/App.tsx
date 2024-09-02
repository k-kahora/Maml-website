import React, { useState } from 'react';

import AceEditor from 'react-ace';
import 'ace-builds/src-noconflict/mode-javascript';

import 'ace-builds/src-noconflict/theme-github';

import { QueryClient, QueryClientProvider, useQuery, useMutation } from 'react-query';
import axios from "axios";

const queryClient = new QueryClient()


function GetData() {
  const { isLoading, error, data } = useQuery('repoData', () =>
    fetch('http://localhost:8000/things').then(res =>
      res.json()
    )
  )

  if (isLoading) return 'Loading...'

  if (error) return 'An error has occurred: ' + error.message

  return (
      <h1>{data.hello}</h1>
  )
}

function SubmitCode({code}) {
    const mutation = useMutation((d) => {
	return axios.post("http://localhost:8000/process-code",d)
    })
    
    const submitData = () => {
	mutation.mutate({"input":code})
    }

    if (mutation.isLoading) return 'Loading...'

    if (mutation.error) return 'An error has occurred: ' + mutation.error.message
 if (mutation.isSuccess) {
    // Handle the case where the mutation was successful
     console.log(mutation.data?.data?.output)
    const output = mutation.data?.data?.output; // Safely access the nested data
    return (
      <div>
        <h3>Success</h3>
        <p>Processed Output: {output}</p>
      </div>
    );
  }    
  return (
    <div>
      <h1>Submit Code</h1>
      <button onClick={submitData}>Submit Code</button>
    </div>
  );

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

    <QueryClientProvider client={queryClient}>
      <GetData />
    </QueryClientProvider>

    <QueryClientProvider client={queryClient}>
      <SubmitCode code={code}/>
    </QueryClientProvider>
	</>
    );
}

export default MyEditorComponent;
