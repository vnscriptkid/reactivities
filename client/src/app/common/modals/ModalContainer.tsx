import { observer } from 'mobx-react-lite';
import React from 'react';
import { Modal } from 'semantic-ui-react';
import { useStore } from '../../stores/store';

function ModalContainer() {
    const {modalStore: { modal, closeModal }} = useStore();
    
    return (
        <Modal open={modal.open} onClose={closeModal}>
            <Modal.Content>
                {modal.body}
            </Modal.Content>
        </Modal>
    );
}

export default observer(ModalContainer);