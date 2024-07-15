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
        const element = document.querySelector("#typewriter-text") as HTMLElement; //document.querySelector("#typewriter-text")가 null인지 확인하는 코드를 추가
        if (element && j < currentText.length) {
          element.innerHTML = currentText.substring(0, j + 1) + '<span aria-hidden="true" class="border-r border-white"></span>';
          j++;
          setTimeout(typeWriter, 150);
        } else {
          j = 0;
          i++;
          setTimeout(typeWriter, 1800); // 텍스트가 완전히 입력된 후 대기 시간 (1.8초)
        }
      } else {
        i = 0;
        setTimeout(typeWriter, 1800); // 모든 텍스트가 출력된 후 잠시 멈춤
      }
    }

    typeWriter();
  }, [texts]);

  return (
    <span id="typewriter-text" className="border-r border-yellow-500 text-yellow-200"></span>
  );
};

export default Typewriter;
