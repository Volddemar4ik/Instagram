// import React, {
//     useState,
//     useEffect
// } from 'react';

// import {
//     DndContext,
//     KeyboardSensor,
//     PointerSensor,
//     useSensor,
//     useSensors, useDroppable
// } from "@dnd-kit/core";

// import {
//     sortableKeyboardCoordinates,
//     rectSortingStrategy,
//     SortableContext,
//     useSortable
// } from "@dnd-kit/sortable";

// import { CSS } from "@dnd-kit/utilities";

// import { arrayMoveImmutable } from 'array-move';


// const SortableItem = (props) => {
//     const {
//         attributes,
//         listeners,
//         setNodeRef,
//         transform,
//         transition
//     } = useSortable({ id: props.id });

//     const itemStyle = {
//         transform: CSS.Transform.toString(transform),
//         transition,
//         cursor: "grab",
//     };

//     const Render = props.render

//     return (
//         <div style={itemStyle} ref={setNodeRef} {...attributes} {...listeners}>
//             <Render {...{ [props.itemProp]: props.item }} />
//         </div>
//     );
// };


// const Droppable = ({ id, items, itemProp, keyField, render }) => {
//     return (
//         <SortableContext id={id} items={items} strategy={rectSortingStrategy}>
//             {items?.map((item) => (
//                 <SortableItem render={render} key={item[keyField]} id={item}
//                     itemProp={itemProp} item={item} />
//             ))}
//         </SortableContext>
//     );
// };


// export function Dnd({ items: startItems, render, itemProp, keyField, onChange, horizontal }) {
//     const [items, setItems] = useState(
//         startItems
//     );
//     useEffect(() => setItems(startItems), [startItems])

//     useEffect(() => {
//         if (typeof onChange === 'function') {
//             onChange(items)
//         }
//     }, [items])

//     const sensors = useSensors(
//         useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
//         useSensor(KeyboardSensor, {
//             coordinateGetter: sortableKeyboardCoordinates
//         })
//     );

//     const handleDragEnd = ({ active, over }) => {
//         const activeIndex = active.data.current.sortable.index;
//         const overIndex = over.data.current?.sortable.index || 0;

//         setItems((items) => {
//             return arrayMoveImmutable(items, activeIndex, overIndex)
//         });
//     }

//     const containerStyle = {
//         display: horizontal ? "flex" : '',
//         flex: 1,
//         flexDirection: 'row',
//         alignItems: 'flex-start',
//         flexWrap: 'wrap',
//         alignContent: 'flex-start',
//         justifyContent: 'center',
//         padding: '5px',
//         backgroundColor: '#fafafa',
//         color: '#bdbdbd',
//         position: 'relative'
//     };

//     return (
//         <DndContext
//             sensors={sensors}
//             onDragEnd={handleDragEnd}
//         >
//             <div style={containerStyle}>
//                 <Droppable id="aaa"
//                     items={items}
//                     itemProp={itemProp}
//                     keyField={keyField}
//                     render={render} />
//             </div>
//         </DndContext>
//     );
// }


import React, {
    useState,
    useEffect
} from 'react';

import {
    DndContext,
    KeyboardSensor,
    PointerSensor,
    useSensor,
    useSensors, useDroppable
} from "@dnd-kit/core";

import {
    sortableKeyboardCoordinates,
    rectSortingStrategy,
    SortableContext,
    useSortable
} from "@dnd-kit/sortable";

import { CSS } from "@dnd-kit/utilities";

import { arrayMoveImmutable } from 'array-move';


const SortableItem = (props) => {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition
    } = useSortable({ id: props.id });

    const itemStyle = {
        transform: CSS.Transform.toString(transform),
        transition,
        cursor: "grab",
    };

    const Render = props.render

    return (
        <div style={itemStyle} ref={setNodeRef} {...attributes} {...listeners}>
            <Render {...{ [props.itemProp]: props.item }} />
        </div>
    );
};


const Droppable = ({ id, items, itemProp, keyField, render }) => {
    return (
        <SortableContext id={id} items={items} strategy={rectSortingStrategy}>
            {items?.map((item) => (
                <SortableItem render={render} key={item[keyField]} id={item}
                    itemProp={itemProp} item={item} />
            ))}
        </SortableContext>
    );
};


export function Dnd({ items: startItems, render, itemProp, keyField, onChange, horizontal }) {
    const [items, setItems] = useState(
        startItems
    );
    useEffect(() => setItems(startItems), [startItems])

    useEffect(() => {
        if (typeof onChange === 'function') {
            onChange(items)
        }
    }, [items])

    const sensors = useSensors(
        useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates
        })
    );

    const handleDragEnd = ({ active, over }) => {
        const activeIndex = active.data.current.sortable.index;
        const overIndex = over.data.current?.sortable.index || 0;

        setItems((items) => {
            return arrayMoveImmutable(items, activeIndex, overIndex)
        });
    }

    const containerStyle = {
        display: horizontal ? "flex" : '',
        flex: 1,
        flexDirection: 'row',
        alignItems: 'flex-start',
        flexWrap: 'wrap',
        alignContent: 'flex-start',
        justifyContent: 'center',
        padding: '5px',
        backgroundColor: '#fafafa',
        color: '#bdbdbd',
        position: 'relative'
    };

    return (
        <DndContext
            sensors={sensors}
            onDragEnd={handleDragEnd}
        >
            <div style={containerStyle}>
                <Droppable id="aaa"
                    items={items}
                    itemProp={itemProp}
                    keyField={keyField}
                    render={render} />
            </div>
        </DndContext>
    );
}