import { useEffect } from 'react';

interface TypewriterProps {
  texts: string[];
}

const Typewriter: React.FC<TypewriterProps> = ({ texts }) => {
  useEffect(() => {
    let i = 0;
    let j = 0;

    function typeWriter() {
      if (i < texts.length) {
        const currentText = texts[i];
        if (j < currentText.length) {
          (document.querySelector("#typewriter-text") as HTMLElement).innerHTML = currentText.substring(0, j + 1) + '<span aria-hidden="true" class="border-r border-white"></span>';
          j++;
          setTimeout(typeWriter, 100);
        } else {
          j = 0;
          i++;
          setTimeout(typeWriter, 1800); // 텍스트가 완전히 입력된 후 대기 시간 (1.5초)
        }
      } else {
        i = 0;
        setTimeout(typeWriter, 1800); // 모든 텍스트가 출력된 후 잠시 멈춤
      }
    }

    typeWriter();
  }, [texts]);

  return (
    <span id="typewriter-text" className="border-r border-white border-yellow-500 text-yellow-300"></span>
  );
};

export default Typewriter;
