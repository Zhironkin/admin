import React from 'react';
import PropTypes from 'prop-types';
import {Button, Modal, ModalBody, ModalFooter, ModalHeader} from 'reactstrap';

export const ConfirmModal = ({
                                 isOpen,
                                 size,
                                 title,
                                 confirmTitle,
                                 discardTitle,
                                 confirmBtnColor,
                                 discardBtnColor,
                                 children,
                                 confirm,
                                 discard,
                                 isInvalid,
                                 hideDiscardBtn
                             }) => {
    return <Modal isOpen={isOpen} size={size} toggle={discard}>
        {title && <ModalHeader>{title}</ModalHeader>}
        <ModalBody>{children}</ModalBody>
        <ModalFooter className="text-right">
            {!hideDiscardBtn && <Button
                color={discardBtnColor || 'warning-outline'} onClick={discard}
                className="mr-10"
            >
                {discardTitle}
            </Button>}
            <Button color={confirmBtnColor || 'primary'} onClick={confirm} disabled={isInvalid}>
                {confirmTitle}
            </Button>
        </ModalFooter>
    </Modal>;
};

ConfirmModal.propTypes = {
    isOpen: PropTypes.bool.isRequired,
    size: PropTypes.string,
    isInvalid: PropTypes.bool,
    title: PropTypes.string.isRequired,
    confirmTitle: PropTypes.string.isRequired,
    discardTitle: PropTypes.string.isRequired,
    confirmBtnColor: PropTypes.string,
    discardBtnColor: PropTypes.string,
    confirm: PropTypes.func.isRequired,
    discard: PropTypes.func.isRequired,
    hideDiscardBtn: PropTypes.bool
};
