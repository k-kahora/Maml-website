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
      <><NavBar />
  <div className="container">
      <img src={mamlLogo} alt="" />
      <Editor /> 
      {/*
      <Editor />
      <NavBar/>
      <Terminal />
      */}
  </div>
  </>
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
    <div className="nav-bar">
      <p>Printing</p>
    </div>
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

function Editor() {
  const [code, setCode] = useState(`
let fact = fn(x) {
  if ( x < 2 ) {
    1
  }
  else {
    x * fact(x - 1)
  }
puts(fact(5))
`);
  const [output, setOutput] = useState('output');

  const handleSuccess = (output) => {
    setOutput(output);
  };

  const handleError = (error) => {
    setOutput(error);
  };

  return (
    <>
      <InputBox code={code} setCode={setCode} />
      <QueryClientProvider client={queryClient}>
        <ExecuteCode code={code} success={handleSuccess} error={handleError} />
      </QueryClientProvider>
      <OutputBox output={output} />
      <Code setCode={setCode}/>
    </>
  );
}
    


function OutputBox({ output }) {
  return (
      <p className='output'>{output}</p>
  );
}

// This should return the posted data
function ExecuteCode({ code, success, error }) {
  const mutation = useMutation(() => {
    return axios.post("http://localhost:8000/ocaml", { input: code });
  });

  const handleSubmit = () => {
    mutation.mutate(null, {
      onSuccess: (data) => {
        success(data?.data?.result || 'OUTPUT');
      },
      onError: (err) => {
        error(`An error occurred: ${err.message}`);
      }
    });
  };

  return <SubmitButton onClick={handleSubmit} isLoading={mutation.isLoading} />;
}

function DescriptionInput() {
  return 
}

function Code({ setCode }) {
  const [codeIndex, setCodeIndex] = useState(0)
  const tupleArray: [string, string][] = [
    ["first", "second"],
    ["apple", "banana"],
    ["cat", "dog"],
    ["foo", "bar"]
  ];
  function code_set(index) {
    console.log(index)
    setCode(tupleArray[index][0]);
  }
  const handleButtonClick1 = () => {
    setCodeIndex(codeIndex + 1) 
    code_set(codeIndex)
  };

  const handleButtonClick2 = () => {
    setCodeIndex(codeIndex - 1) 
    code_set(codeIndex)
  };

  return (
    <div className="code-button">
      <button onClick={handleButtonClick1}>Button 1</button>
      <button onClick={handleButtonClick2}>Button 2</button>
    </div>
  );
}

function Description() {

  return <div className="description">
    <button>
      Prev
    </button>
    <button>
          Nex
    </button>
  </div>

}

function InputBox({ code, setCode }) {
  function onChange(newValue) {
    setCode(newValue);
  }

  return (
    <div className='editor'>
      <AceEditor
        mode="javascript"
        theme="github"
        onChange={onChange}
        name="editor"
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
    </div>
  );
}
export default App;
