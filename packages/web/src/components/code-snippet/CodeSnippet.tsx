import hljs from "highlight.js/lib/core";
import javascript from "highlight.js/lib/languages/javascript";
import { useEffect, useRef } from "react";

hljs.registerLanguage("javascript", javascript);

const CodeSnippet = ({ code }) => {
  const codeRef = useRef(null);

  useEffect(() => {
    // if (code && codeRef?.current) {
    hljs.highlightBlock(codeRef?.current);
    // }
  }, []);

  return (
    <pre>
      <code className="javascript" ref={codeRef}>
        {code}
      </code>
    </pre>
  );
};

export default CodeSnippet;
