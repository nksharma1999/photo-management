import "./PreviewModal.css";

type Props = {
  image: string;
  onClose: () => void;
};

export default function PreviewModal({ image, onClose }: Props) {
  return (
    <div className="preview-overlay" onClick={onClose}>
      <div className="preview-container">
        <img src={image} alt="preview" />
      </div>
    </div>
  );
}