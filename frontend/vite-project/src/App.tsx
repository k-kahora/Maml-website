import React, { useState } from 'react';
import mamlLogo from './assets/maml.png';
import AceEditor from 'react-ace';
import 'ace-builds/src-noconflict/mode-javascript';
import 'ace-builds/src-noconflict/theme-github';
import { QueryClient, QueryClientProvider, useQuery, useMutation } from 'react-query';
import axios from "axios";
import { renderToStaticMarkup } from 'react-dom/server';
const queryClient = new QueryClient()

function Grid() {
  return (
  <div className="container">
      {/*
      <Editor />
      <NavBar/>
      <Terminal />
      */}
  </div>
  )

}

function App() {
  return (
  <div className="App">
      < Grid/>
  </div>

  ) 
}

function Terminal() {
  return <>
    <div className="terminal">
      <div className="header">
        <div className="circle"></div>
        <div className="circle"></div>
        <div className="circle"></div>
      </div>
      <div className="body">
        {/* This needs to be a whitespace font */}
        <p>=={`>`} <span>let</span> x = 30;</p>
        <p>=={`>`} x</p>
        <p className="response">30</p>
        <p>=={`>`} <span>let</span> fact = fn(x) {"{"}</p>
        <pre>       if ( x {"<"} 1 ) </pre>
        <pre>         {"{"} 1 {"}"} </pre>
        <pre>       else {"{"} </pre>

        <pre>         x * fact(x - 1) </pre>
        <pre>       {"}"}</pre>
        <pre>    {"}"}</pre>
        <p>=={`>`} <span>puts</span>(fact(5))</p>
        <p className="response">120</p>
      </div>
    </div>
  </>
}

function NavBar() {
  return (
          <>
      <img src={mamlLogo} alt="" />
 </>
  )
}
          // <button className="nav-button">Docs</button>
          // <button className="nav-button">Code</button>
          // <button className="nav-button">About</button>

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

    const [code, setCode] = useState(`let fact = fn(x) {
  if ( x < 2 ) {
    1
  }
  else {
    x * fact(x - 1)
  }
puts(fact(5))
}`);
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
      <div className='editor'>
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
        </div>
    );
}

export default App;
