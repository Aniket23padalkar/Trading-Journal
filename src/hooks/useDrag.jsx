import { useContext, useEffect, useRef, useState } from "react";
import { ZIndexStacking } from "../utils/zIndexStacking";
import { GlobalContext } from "../context/Context";

export default function useDrag() {
  const { isDragging, setIsDragging } = useContext(GlobalContext);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const modalRef = useRef(null);

  function handleMouseDown(e) {
    if (!modalRef.current) return;

    modalRef.current.style.zIndex = ZIndexStacking();
    const rect = modalRef.current.getBoundingClientRect();
    setIsDragging(true);
    setOffset({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
  }

  function handleMouseMove(e) {
    if (!isDragging) return;
    modalRef.current.style.left = `${e.clientX - offset.x}px`;
    modalRef.current.style.top = `${e.clientY - offset.y}px`;
    modalRef.current.style.transform = "none";
  }

  const handleMouseUp = () => setIsDragging(false);

  useEffect(() => {
    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };
  }, [modalRef, handleMouseDown]);

  return { modalRef, handleMouseDown };
}
