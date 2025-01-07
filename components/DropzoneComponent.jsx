import { postData } from "@/utils/api";
import { AddTaskActivity, FormatDate } from "@/utils/common";
import { useCallback, useState, useEffect } from "react";
import { useDropzone } from "react-dropzone";
import { useSelector } from "react-redux";
import { IoCloudUploadOutline } from "react-icons/io5";

const DropzoneComponent = ({ taskId, project_id, refetchTaskActivity, refetchTaskComments }) => {
  const [files, setFiles] = useState([]);
  const [uploading, setUploading] = useState(false);
  const user = useSelector((state) => state.auth.user);
  // Handle files dropped or selected
  const onDrop = useCallback((acceptedFiles) => {
    setFiles((prevFiles) => [
      ...prevFiles,
      ...acceptedFiles.map((file) =>
        Object.assign(file, {
          preview: URL.createObjectURL(file),
        })
      ),
    ]);
  }, []);

  // Handle file removal
  const removeFile = (fileName) => {
    setFiles((prevFiles) => prevFiles.filter((file) => file.name !== fileName));
  };

  // Handle file upload
  const uploadFile = async (file) => {
    setUploading(true);

    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (res.ok) {
        //  // Optionally, clear the files list after successful upload

        console.log("file_uploaded", res);
        console.log("file_uploadedfile", file);

       

        const responsse = await postData("api/tasks/comment/addimage", {
          user_id: user?.id,
          project_id: project_id,
          task_id: taskId,
          attachments: data.file.filename,
        });

        ActivityStats(`Uploaded a image ${file.name}`, taskId, project_id)
        refetchTaskComments();
        refetchTaskActivity();
        

        setFiles([]);

        console.log("file_responsse", responsse);
      } else {
        throw new Error("Failed to upload file");
      }
    } catch (error) {
      console.error(error.message);
    } finally {
      setUploading(false);
    }
  };

  // Automatically upload the files after drop
  useEffect(() => {
    if (files.length > 0) {
      files.forEach((file) => {
        uploadFile(file); // Upload each file as it's added
      });
    }
  }, [files]);

  const ActivityStats = (activityContent, task_id, project_id) => {
    AddTaskActivity(() => console.log("uploaded activity logged"),{
      user_id: user?.id,
      task_id:task_id,
      project_id:project_id,
      activity: activityContent,
      activity_type: 1,
      created_at: FormatDate(Date.now()),
      updated_at:FormatDate(Date.now())
    })
  }

  const {
    getRootProps,
    getInputProps,
    isDragActive,
    isDragReject,
    isDragAccept,
  } = useDropzone({
    onDrop,
    accept: {
      "image/*": [], // Accept only image files
    },
  });

  const baseStyle = {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "column",
    width: "100%",
    height: "50px",
    borderWidth: 1,
    borderRadius: 10,
    borderColor: "#cccccc",
    borderStyle: "dashed",
    backgroundColor: "#fff",
    color: "#000",
    transition: "border 0.3s ease-in-out",
    margin: "20px auto",
  };

  const activeStyle = {
    borderColor: "#2196f3",
    backgroundColor: "#e3f2fd",
  };

  const acceptStyle = {
    borderColor: "#00e676",
    backgroundColor: "#f0fff4",
  };

  const rejectStyle = {
    borderColor: "#ff1744",
    backgroundColor: "#ffe7e7",
  };

  const style = {
    ...baseStyle,
    ...(isDragActive ? activeStyle : {}),
    ...(isDragAccept ? acceptStyle : {}),
    ...(isDragReject ? rejectStyle : {}),
  };

  useEffect(() => {
    // Cleanup preview URLs to prevent memory leaks
    return () => files.forEach((file) => URL.revokeObjectURL(file.preview));
  }, [files]);

  return (
    <div>
      <div {...getRootProps({ style })} className="cursor-pointer">
        <input {...getInputProps()} />
        {isDragReject ? (
          <p>Unsupported file type...</p>
        ) : (
          <p className="flex items-center gap-1"><IoCloudUploadOutline className="mr-1 text-md text-gray-500" />Drag and drop your files here. <span className="text-blue-600">Browse files</span></p>
        )}
      </div>

      {/* {/ Scrollable container for uploaded files /} */}
      <div
        style={{
          marginTop: "20px",
          maxHeight: "250px",
          overflowY: "auto",
          border: "none",
          borderRadius: "none",
          padding: "0",
          display: "flex",
          flexWrap: "wrap",
          gap: "10px",
        }}
      >
        {files.map((file) => (
          <div
            key={file.name}
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              margin: "10px",
              position: "relative",
            }}
          >
            <img
              src={file.preview}
              alt={file.name}
              style={{
                width: "75px",
                height: "75px",
                objectFit: "cover",
                borderRadius: "5px",
              }}
            />
            <button
              onClick={() => removeFile(file.name)}
              style={{
                position: "absolute",
                top: "5px",
                right: "5px",
                backgroundColor: "red",
                color: "white",
                border: "none",
                borderRadius: "50%",
                width: "20px",
                height: "20px",
                cursor: "pointer",
                fontSize: "12px",
              }}
            >
              &times;
            </button>
            <p
              style={{
                fontSize: "12px",
                textAlign: "center",
                marginTop: "5px",
                wordBreak: "break-word",
              }}
            >
              {file.name}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DropzoneComponent;