export const onDragEnd = (initialData, currentUser, setInitialData, app) => {
    return (result) => {
        const { destination, source, draggableId } = result;

        if (!destination) return;

        const startColumn = initialData.columns.find((col) => col.id === source.droppableId);
        const startColumnIndex = initialData.columns.findIndex((col) => col.id === source.droppableId);
        const endColumn = initialData.columns.find((col) => col.id === destination.droppableId);
        const endColumnIndex = initialData.columns.findIndex((col) => col.id === destination.droppableId);

        if (startColumn === endColumn) {
            const newPositionIds = Array.from(endColumn.positionIds);

            newPositionIds.splice(source.index, 1);
            newPositionIds.splice(destination.index, 0, draggableId);

            const newColumn = {
                ...endColumn,
                positionIds: newPositionIds,
            };

            const newState = {
                ...initialData,
                columns: [...initialData.columns],
            };

            newState.columns[endColumnIndex] = newColumn;

            app.firestore()
                .collection('users')
                .doc(`${currentUser.uid}`)
                .collection('columns')
                .doc(`${startColumn.id}`)
                .update({ positionIds: newPositionIds });

            setInitialData(newState);

            return;
        }

        const startPositionIDs = Array.from(startColumn.positionIds);
        startPositionIDs.splice(source.index, 1);
        const newStart = {
            ...startColumn,
            taskIds: startPositionIDs,
        };

        const finishPositionIDs = Array.from(endColumn.positionIds);
        finishPositionIDs.splice(destination.index, 0, draggableId);
        const newFinish = {
            ...endColumn,
            taskIds: finishPositionIDs,
        };

        const newState = {
            ...initialData,
            columns: [...initialData.columns],
        };

        newState.columns[startColumnIndex] = newStart;
        newState.columns[endColumnIndex] = newFinish;

        app.firestore()
            .collection('users')
            .doc(`${currentUser.uid}`)
            .collection('columns')
            .doc(`${startColumn.id}`)
            .update({ positionIds: startPositionIDs });

        app.firestore()
            .collection('users')
            .doc(`${currentUser.uid}`)
            .collection('columns')
            .doc(`${endColumn.id}`)
            .update({ positionIds: finishPositionIDs });

        app.firestore().collection('positions').doc(`${draggableId}`).update({ status: endColumn.title });
        setInitialData(newState);
    };
};
