import ModalUI, { Props } from "deco-components/components/ui/Modal.tsx";
import { useModalUI } from "deco-components/sdk/ui/useModal.ts";

export type { Props };

function Modal(props: Props) {
  const { displayModal, closeModal } = useModalUI();

  const isModalOpen = displayModal.open.value;
  const modalContent = displayModal.children.value;

  return (
    <ModalUI
      loading="lazy"
      open={isModalOpen}
      onClose={closeModal}
      {...props}
      {...displayModal.props}
    >
      {modalContent}
    </ModalUI>
  );
}

export default Modal;
