import React, { useState } from "react";
import { Button, Modal } from "react-bootstrap";
export default function modalConfirm({
  show,
  acceptAction,
  denyAction,
  acceptTitle,
  denyTitle,
  hideAction,
  title,
  text,
}) {
  return (
    <Modal
      show={show}
      onHide={() => {
        hideAction();
      }}
      animation={true}
    >
      <Modal.Header closeButton>
        <Modal.Title>Title</Modal.Title>
      </Modal.Header>
      <Modal.Body>{text}</Modal.Body>
      <Modal.Footer>
        <Button
          variant="secondary"
          onClick={() => {
            acceptAction();
          }}
        >
          {acceptTitle}
        </Button>
        <Button
          variant="primary"
          onClick={() => {
            denyAction();
          }}
        >
          {denyTitle}
        </Button>
      </Modal.Footer>
    </Modal>
  );
}
