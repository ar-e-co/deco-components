import ModalUI, { Props } from "deco-components/components/ui/Modal.tsx";
import { useModal } from "deco-components/sdk/ui/useModal.ts";

export type { Props };

function Modal(props: Props) {
  const { displayModal, closeModal } = useModal();

  const isModalOpen = displayModal.open.value;
  const modalContent = displayModal.children.value;

  return (
    <ModalUI
      loading="lazy"
      open={isModalOpen}
      onClose={closeModal}
      {...props}
    >
      {modalContent}
    </ModalUI>
  );
}

export default Modal;
