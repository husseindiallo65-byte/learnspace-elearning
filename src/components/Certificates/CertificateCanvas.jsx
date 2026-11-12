import { interpolateCertificateText } from "../../utils/certificateTemplates.js";
import "./CertificateCanvas.css";

export default function CertificateCanvas({
  template,
  variables,
  selectedElementId,
  onSelectElement,
  onElementPointerDown,
  onPointerMove,
  onPointerUp,
  canvasRef,
  preview = false,
}) {
  const aspectRatio = template.format === "portrait"
    ? 210 / 297
    : template.format === "custom" && template.customWidth && template.customHeight
      ? Number(template.customWidth) / Number(template.customHeight)
      : 297 / 210;

  return (
    <div
      ref={canvasRef}
      className={`certificate-canvas frame-${template.frame || "minimal"} ${preview ? "is-preview" : ""}`}
      style={{
        aspectRatio,
        "--certificate-accent": template.accent || "#5FEB98",
        backgroundColor: template.background || "#fff",
        backgroundImage: template.backgroundImage
          ? `url("${template.backgroundImage}")`
          : template.gradient || "none",
      }}
      aria-label="Aperçu du certificat"
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onPointerCancel={onPointerUp}
    >
      {(template.elements || []).map((element) => {
        const content = interpolateCertificateText(element.content || "", variables);
        const style = {
          left: `${element.x}%`,
          top: `${element.y}%`,
          width: `${element.w}%`,
          height: `${element.h}%`,
          color: element.color || "#253345",
          fontFamily: element.font || "Arial",
          fontSize: `${element.size || 2}cqw`,
          fontWeight: element.weight || 400,
          textAlign: element.align || "center",
          opacity: element.opacity ?? 1,
          transform: `rotate(${element.rotation || 0}deg)`,
        };

        if (element.type === "shape") {
          return (
            <button
              type="button"
              key={element.id}
              className={`certificate-canvas-shape ${selectedElementId === element.id ? "is-selected" : ""}`}
              style={{ ...style, background: element.color || template.accent }}
              onPointerDown={(event) => onElementPointerDown?.(event, element)}
              onClick={() => onSelectElement?.(element.id)}
              aria-label="Forme décorative"
            />
          );
        }

        if (element.type === "image") {
          return (
            <button
              type="button"
              key={element.id}
              className={`certificate-canvas-image ${selectedElementId === element.id ? "is-selected" : ""}`}
              style={style}
              onPointerDown={(event) => onElementPointerDown?.(event, element)}
              onClick={() => onSelectElement?.(element.id)}
              aria-label="Image du certificat"
            >
              {element.content
                ? <img src={content} alt="" draggable="false" />
                : <span>Importer un logo</span>}
            </button>
          );
        }

        return (
          <button
            type="button"
            key={element.id}
            className={`certificate-canvas-text ${selectedElementId === element.id ? "is-selected" : ""} ${preview ? "is-static" : ""}`}
            style={style}
            onPointerDown={(event) => onElementPointerDown?.(event, element)}
            onClick={() => onSelectElement?.(element.id)}
            aria-label={`Texte : ${content}`}
            tabIndex={preview ? -1 : 0}
          >
            {content}
          </button>
        );
      })}
      <span className="certificate-canvas-id">{variables.certificate_id}</span>
    </div>
  );
}
