import { useState, Fragment } from "react";

export default function FileUploadBox() {
  // 이미지 파일 자체의 상태
  const [file, setFile] = useState("");
  // 이미지 파일의 url
  const [uploadedImage, setUploadedImage] = useState("");

  // 파일 데이터 보관하기 위한 함수
  const handleFileChange = (e) => {
    const { files } = e.target;
    setFile(files[0]);

    const reader = new FileReader();
    reader.readAsDataURL(file);

    reader.onloadend = () => {
      setUploadedImage(reader.result);
    };
  };

  return (
    <Fragment>
      <div>
        <label className="mr-10 text-xl font-medium">메인 이미지</label>
        <img src={`assets/airplain.jpg`} alt="기본이미지" />
        <input type="file" onChange={handleFileChange} />
      </div>
    </Fragment>
  );
}
