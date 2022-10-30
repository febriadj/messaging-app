import React, { useEffect } from 'react';
import emojis from './emoji.json';

function EmojiBoard({ setForm }) {
  useEffect(() => {
    const monitor = document.querySelector('#monitor');
    monitor.scrollTop += 160;
  }, []);

  return (
    <div id="emoji-board" className="h-36 mb-4 px-3 overflow-y-auto scrollbar-thin scrollbar-thumb-spill-200 hover:scrollbar-thumb-spill-300 dark:scrollbar-thumb-spill-700 dark:hover:scrollbar-thumb-spill-600">
      {
        emojis.map((elem) => (
          <button
            key={elem.emoji}
            type="button"
            className="w-8 h-8 text-xl rounded-full hover:bg-spill-100 dark:hover:bg-spill-800"
            onClick={() => {
              const { selectionStart } = document.querySelector('#new-message');

              setForm((prev) => {
                const start = prev.text.slice(0, selectionStart);
                const end = prev.text.slice(selectionStart);

                return { ...prev, text: start + elem.emoji + end };
              });
            }}
          >
            {elem.emoji}
          </button>
        ))
      }
    </div>
  );
}

export default EmojiBoard;
