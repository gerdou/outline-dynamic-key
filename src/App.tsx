import React, {useEffect, useRef, useState} from 'react';
import styled from 'styled-components';

// Styled Components
const DecoderContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  background-color: #282c34;
  padding: 1em;
`;

const DecoderSection = styled.div`
  width: 50%;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const Label = styled.label`
  color: white;
  font-size: calc(10px + 2vmin);
  align-self: flex-start;
`;

const InputField = styled.input`
  width: 100%;
  margin: 1em 0;
  padding: 1em;
`;

const Button = styled.button`
  background-color: #61dafb;
  border: none;
  border-radius: 3px;
  color: white;
  padding: 0.5em 1em;
  font-weight: bold;
  font-size: 1em;
  cursor: pointer;
  align-self: flex-end;
`;

const OutputField = styled.textarea`
  width: 100%;
  margin: 1em 0;
  padding: 1em;
  resize: none;
`;

function decodeSSLink(ss: string) {
  const re = /^ss:\/\/(.*?)@(.*?):(\d+)(\/?outline=1)?(.*)$/;
  const matches = ss.match(re);

  if (matches === null) {
    return "No matches found";
  }

  const data = window.atob(matches[1]);
  const parts = data.split(":");

  if (parts.length !== 2) {
    return "Incorrect format for method and password";
  }

  const method = parts[0],
      password = parts[1];
  const key = {
    server: matches[2],
    server_port: parseInt(matches[3], 10),
    password: password,
    method: method,
  };

  return JSON.stringify(key, null, 2);
}

function App() {
  const [ss, setSs] = useState("");
  const [output, setOutput] = useState("");
  const outputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (outputRef.current) {
      outputRef.current.style.height = 'inherit';
      const scrollHeight = outputRef.current.scrollHeight;
      outputRef.current.style.height = scrollHeight + 'px';
    }
  }, [output]);

  const handleChange = (e: { target: { value: React.SetStateAction<string>; }; }) => {
    setSs(e.target.value);
  };

  const handleSubmit = (e: { preventDefault: () => void; }) => {
    e.preventDefault();
    setOutput(decodeSSLink(ss));
  };

  return (
      <form onSubmit={handleSubmit}>
        <DecoderContainer>
          <DecoderSection>
            <Label>Enter The Outline Key:</Label>
            <InputField type="text" value={ss} onChange={handleChange} required />
            <Button type="submit">Submit</Button>
          </DecoderSection>
          <DecoderSection>
            {output && (
                <>
                <Label>Output</Label>
                  <OutputField readOnly ref={outputRef} value={output} />
                </>
            )}
          </DecoderSection>
        </DecoderContainer>
      </form>
  );
}

export default App;
