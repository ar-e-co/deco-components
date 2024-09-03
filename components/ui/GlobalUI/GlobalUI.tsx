import Toast from "./Toast.tsx";
import Modal from "./Modal.tsx";

/**
 * @description Import as an island, and then as a Section.
 * Used to ship only 1 instance of each component to the client.
 */
function GlobalUI() {
  return (
    <>
      <Modal />

      <Toast
        horizontalPosition="toast-start"
        verticalPosition="toast-bottom"
      />
    </>
  );
}

export default GlobalUI;
