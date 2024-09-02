import React, { useState } from 'react';

import AceEditor from 'react-ace';
import 'ace-builds/src-noconflict/mode-javascript';

import 'ace-builds/src-noconflict/theme-github';

import { QueryClient, QueryClientProvider, useQuery } from 'react-query'

const queryClient = new QueryClient()


function Example() {
  const { isLoading, error, data } = useQuery('repoData', () =>
    fetch('https://api.github.com/repos/tannerlinsley/react-query').then(res =>
      res.json()
    )
  )

  if (isLoading) return 'Loading...'

  if (error) return 'An error has occurred: ' + error.message

  return (
    <div>
      <h1>{data.name}</h1>
      <p>{data.description}</p>
      <strong>👀 {data.subscribers_count}</strong>{' '}
      <strong>✨ {data.stargazers_count}</strong>{' '}
      <strong>🍴 {data.forks_count}</strong>
    </div>
  )
}

function Example2() {
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

    <QueryClientProvider client={queryClient}>
      <Example2 />
    </QueryClientProvider>
	</>
    );
}

export default MyEditorComponent;
