import { useRef } from "react";
import { useDrag, useDrop } from "react-dnd";

type DraggableItem = {
  index: number;
  id: string;
};

export const Draggable = ({
  children,
  onMove,
  index,
  id,
}: {
  children: React.ReactElement;
  onMove: (currentIndex: number, nextIndex: number) => void;
  index: number;
  id: string;
}) => {
  const daraggableRef = useRef(null);
  const typeOfDropItem = "DropItemType";

  const [, drop] = useDrop({
    accept: typeOfDropItem,
    hover(item: DraggableItem) {
      if (!daraggableRef.current) {
        return;
      }
      const dragIndex = item.index;
      const hoverIndex = index;
      if (dragIndex === hoverIndex) {
        return;
      }
      onMove(dragIndex, hoverIndex);
      item.index = hoverIndex;
    },
  });

  const [{ isDragging }, drag] = useDrag(() => ({
    type: typeOfDropItem,
    item: { id, index },
    collect: (monitor) => {
      return {
        isDragging: monitor.isDragging(),
      };
    },
  }));

  drag(drop(daraggableRef));

  return (
    <div
      className="mr-2"
      ref={daraggableRef}
      style={{
        opacity: isDragging ? 0 : 1,
        background: "transparent",
        display: "inline-block",
      }}
    >
      {children}
    </div>
  );
};
