"use client"; // This component must be a client component

import {
  ImageKitAbortError,
  ImageKitInvalidRequestError,
  ImageKitServerError,
  ImageKitUploadNetworkError,
  upload,
} from "@imagekit/next";
import { useRef, useState } from "react";
import { Input } from "../ui/input";
import { ImageKitFolder } from "@/constants/enum";
import { toast } from "sonner";
// UploadFile component demonstrates file uploading using ImageKit's Next.js SDK.

interface UploadFileProps extends React.HTMLAttributes<HTMLInputElement> {
  folder: ImageKitFolder; // The folder where the file will be uploaded
  setFileUrl: React.Dispatch<React.SetStateAction<string | null>>; // Function to set the uploaded file ID in the parent component
  errorMessage?: string; // Optional error message to display if the upload fails
}

const UploadFile = ({
  folder,
  setFileUrl,
  errorMessage="",
  ...props
}: UploadFileProps) => {
  // State to keep track of the current upload progress (percentage)
    const [progress, setProgress] = useState(0);

  // Create a ref for the file input element to access its files easily
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Create an AbortController instance to provide an option to cancel the upload if needed.
  const abortController = new AbortController();

  /**
   * Authenticates and retrieves the necessary upload credentials from the server.
   *
   * This function calls the authentication API endpoint to receive upload parameters like signature,
   * expire time, token, and publicKey.
   *
   * @returns {Promise<{signature: string, expire: string, token: string, publicKey: string}>} The authentication parameters.
   * @throws {Error} Throws an error if the authentication request fails.
   */
  const authenticator = async () => {
    try {
      // Perform the request to the upload authentication endpoint.
      const response = await fetch("/api/upload-auth");
      if (!response.ok) {
        // If the server response is not successful, extract the error text for debugging.
        const errorText = await response.text();
        throw new Error(
          `Request failed with status ${response.status}: ${errorText}`
        );
      }

      // Parse and destructure the response JSON for upload credentials.
      const data = await response.json();
      const { signature, expire, token, publicKey } = data;
      return { signature, expire, token, publicKey };
    } catch (error) {
      // Log the original error for debugging before rethrowing a new error.
      console.error("Authentication error:", error);
      throw new Error("Authentication request failed");
    }
  };

  /**
   * Handles the file upload process.
   *
   * This function:
   * - Validates file selection.
   * - Retrieves upload authentication credentials.
   * - Initiates the file upload via the ImageKit SDK.
   * - Updates the upload progress.
   * - Catches and processes errors accordingly.
   */
  const handleUpload = async () => {
    console.log('handleUpload called');
    // Access the file input element using the ref
    const fileInput = fileInputRef.current;
    if (!fileInput || !fileInput.files || fileInput.files.length === 0) {
      alert("Please select a file to upload");
      return;
    }

    // Extract the first file from the file input
    const file = fileInput.files[0];

    // Retrieve authentication parameters for the upload.
    let authParams;
    try {
      authParams = await authenticator();
    } catch (authError) {
      console.error("Failed to authenticate for upload:", authError);
      return;
    }
    const { signature, expire, token, publicKey } = authParams;

    // Call the ImageKit SDK upload function with the required parameters and callbacks.
    try {
      console.log("Starting file upload:", file.name);
      
      toast.dismiss();
      toast.loading(`Uploading ${progress}%`, {
        id: "upload-toast",
        duration: 0, // Keep the toast visible until manually dismissed
      });
      // return
      // Reset fileId to null before upload to ensure no stale data is used.

      setFileUrl(null); // Reset fileId before upload
      const uploadResponse = await upload({
        // Authentication parameters
        expire,
        token,
        signature,
        publicKey,
        file,
        ...(folder.trim() && { folder }), // Specify the folder where the file will be uploaded
        fileName: file.name, // Optionally set a custom file name
        // Progress callback to update upload progress state
        onProgress: (event) => {
          setProgress((event.loaded / event.total) * 100);
        },
        // Abort signal to allow cancellation of the upload if needed.
        abortSignal: abortController.signal,
      });
      console.log("Upload response:", uploadResponse);
      toast.dismiss();
      toast.success("File uploaded successfully");
      setFileUrl(uploadResponse?.url || null); // Set the fileId after successful upload
      // Reset the file input value to allow re-uploading the same file if needed.
    } catch (error) {
      toast.dismiss();
      toast.error("File upload failed");
      setFileUrl(null); // Reset fileId on error
      // Handle specific error types provided by the ImageKit SDK.
      if (error instanceof ImageKitAbortError) {
        console.error("Upload aborted:", error.reason);
      } else if (error instanceof ImageKitInvalidRequestError) {
        console.error("Invalid request:", error.message);
      } else if (error instanceof ImageKitUploadNetworkError) {
        console.error("Network error:", error.message);
      } else if (error instanceof ImageKitServerError) {
        console.error("Server error:", error.message);
      } else {
        // Handle any other errors that may occur.
        console.error("Upload error:", error);
      }
    }
  };

  return (
    <>
      {/* File input element using React ref */}
      <label className="block mb-2 text-sm font-medium text-gray-700 text-left">
        Upload File
        <span className="text-xs text-gray-500">(Max size: 5MB)</span>
        <Input
          type="file"
          accept="image/*"
          ref={fileInputRef}
          onChange={handleUpload}
          errorMessage= {errorMessage} // Display error message if provided
          {...props}
        />
      </label>
      {/* Display the current upload progress */}
      {/* Button to trigger the upload process */}
      {/* <Button type="button" onClick={handleUpload}>
        Upload file
      </Button>
      <br />
      {/* Display the current upload progress */}
      {/* Upload progress: <progress value={progress} max={100}></progress>  */}
    </>
  );
};

export default UploadFile;
