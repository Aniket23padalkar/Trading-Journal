import { useEffect, useRef, useState } from "react";
import { ZIndexStacking } from "../utils/zIndexStacking.js";

type Offset = {
  x: number;
  y: number;
};

export default function useDrag() {
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [offset, setOffset] = useState<Offset>({ x: 0, y: 0 });
  const modalRef = useRef<HTMLDivElement | null>(null);

  function handleMouseDown(e: React.MouseEvent<HTMLDivElement>) {
    if (!modalRef.current) return;

    modalRef.current.style.zIndex = String(ZIndexStacking());
    const rect = modalRef.current.getBoundingClientRect();
    setIsDragging(true);
    setOffset({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
  }

  function handleMouseMove(e: MouseEvent) {
    if (!isDragging || !modalRef.current) return;
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
