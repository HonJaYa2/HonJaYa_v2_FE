interface ModalState {
  isOpened: boolean;
}

type ModalAction = {type: 'SHOW_MODAL'} | {type: 'CLOSE_MODAL'};



const initialState: ModalState = {
  isOpened: false,
};

const matchingStatusModal = (state = initialState, action : ModalAction) => {
  switch (action.type) {
    case 'SHOW_MODAL':
      return { ...state, isOpened: true };
    case 'CLOSE_MODAL':
      return { ...state, isOpened: false };
    default:
      return state;
  }
};

export default matchingStatusModal;