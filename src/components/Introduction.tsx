export const Introduction: React.FC = () => {
  return (
    <>
      <h1 className="text-center">Image Vectorizer</h1>
      <h3 className="text-center">
        Transform JPG/JPEG/PNG/GIF images to SVG vector graphics
      </h3>
      <h4>
        Usage:
        <ol>
          <li>
            Select an image by clicking on
            <span className="badge bg-secondary mx-2">Choose File</span>
          </li>
          <li>Adjust vectorization settings (coming soon)</li>
          <li>
            Upload the image by clicking on
            <span className="badge bg-primary mx-2">Upload</span>
          </li>
        </ol>
      </h4>
    </>
  );
};
