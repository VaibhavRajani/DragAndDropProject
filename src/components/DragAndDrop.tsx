"use client";

import { useEffect, useState } from "react";
import { Draggable, Droppable, DropResult } from "react-beautiful-dnd";
import LoadingSkeleton from "./LoadingSkeleton";
import { DndContext } from "@/context/DndContext";
import { cardsData } from "@/bin/CardsData";
import Image from "next/image";

interface Component {
  id: number;
  name: string;
  photoUrl: string;
  address: string;
}

interface Cards {
  id: number;
  title: string;
  components: Component[];
}

const DragAndDrop = () => {
  const [data, setData] = useState<Cards[] | []>([]);
  const onDragEnd = (result: DropResult) => {
    const { source, destination } = result;
    if (!destination) return;
    if (source.droppableId !== destination.droppableId) {
      const newData = [...JSON.parse(JSON.stringify(data))];
      const oldDroppableIndex = newData.findIndex(
        (x) => x.id == source.droppableId.split("droppable")[1]
      );
      const newDroppableIndex = newData.findIndex(
        (x) => x.id == destination.droppableId.split("droppable")[1]
      );
      const [item] = newData[oldDroppableIndex].components.splice(
        source.index,
        1
      );
      newData[newDroppableIndex].components.splice(destination.index, 0, item);
      setData([...newData]);
    } else {
      const newData = [...JSON.parse(JSON.stringify(data))];
      const droppableIndex = newData.findIndex(
        (x) => x.id == source.droppableId.split("droppable")[1]
      );
      const [item] = newData[droppableIndex].components.splice(source.index, 1);
      newData[droppableIndex].components.splice(destination.index, 0, item);
      setData([...newData]);
    }
  };

  useEffect(() => {
    setData(cardsData);
  }, []);

  if (!data.length) {
    return <LoadingSkeleton />;
  }

  return (
    <DndContext onDragEnd={onDragEnd}>
      <h1 className="text-center mt-8 font-bold text-[25px]">
        Tailwind and NextJS Project
      </h1>
      <div className="flex gap-4 justify-center my-10 mx-4">
        {data.map((val, index) => (
          <Droppable key={val.id} droppableId={`droppable${val.id}`}>
            {(provided, snapshot) => (
              <div
                className={`p-5 w-1/3 bg-white border ${"border-dashed"}`}
                {...provided.droppableProps}
                ref={provided.innerRef}
              >
                <h2 className="text-center font-bold mb-6">{val.title}</h2>
                {val.components.map((component, index) => (
                  <Draggable
                    key={component.id}
                    draggableId={component.id.toString()}
                    index={index}
                  >
                    {(provided, snapshot) => (
                      <div
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                        ref={provided.innerRef}
                        className={`flex space-x-4 mx-1 my-3 ${
                          snapshot.isDragging ? "dragging" : ""
                        }`}
                      >
                        {snapshot.isDragging && (
                          <div className="drop-indicator"></div>
                        )}
                        {snapshot.isDragging ? (
                          <div className="card-container">
                            <Image
                              src={component.photoUrl}
                              alt={component.name}
                              width={45}
                              height={45}
                              className="rounded-lg"
                            />
                            <div className="text-xs pl-2 text-center">
                              {component.name}
                            </div>
                          </div>
                        ) : (
                          <>
                            <div className="image-container my-2">
                              <Image
                                src={component.photoUrl}
                                alt={component.name}
                                width={96}
                                height={96}
                                className="rounded-lg"
                              />
                            </div>
                            <div className="flex flex-col justify-center">
                              <div className="font-bold">{component.name}</div>
                              <div className="text-sm text-gray-500">
                                {component.address}
                              </div>
                            </div>
                          </>
                        )}
                      </div>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        ))}
      </div>
    </DndContext>
  );
};

export default DragAndDrop;
