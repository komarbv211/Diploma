import React from 'react';
import type { UploadFile } from 'antd';
import { CSS } from '@dnd-kit/utilities';
import { useSortable } from '@dnd-kit/sortable';


interface DraggableUploadListItemProps {
    originNode: React.ReactElement<any, string | React.JSXElementConstructor<any>>;
    file: UploadFile<any>;
}

const DraggableUploadListItem = ({ originNode, file }: DraggableUploadListItemProps) => {
    const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
        id: file.uid,
    });

    const style: React.CSSProperties = {
        transform: CSS.Transform.toString(transform),
        transition,
        cursor: 'move',
    };

    return (
        <div ref={setNodeRef} style={style} className={isDragging ? 'is-dragging' : ''} {...attributes} {...listeners}>
            {file.status === 'error' && isDragging ? originNode.props.children : originNode}
        </div>
    );
};

export default DraggableUploadListItem;