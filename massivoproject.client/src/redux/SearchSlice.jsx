import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  searchName: '',
  searchDate: '',
  showInNavbar: false,
  events: []
};

export const searchSlice = createSlice({
  name: 'search',
  initialState,
  reducers: {
    setSearchName: (state, action) => {
      state.searchName = action.payload;
    },
    setSearchDate: (state, action) => {
      state.searchDate = action.payload;
    },
    setShowInNavbar: (state, action) => {
      state.showInNavbar = action.payload;
    },
    setEvents: (state, action) => {
      state.events = action.payload;
    },
    resetSearch: (state) => {
      state.searchName = '';
      state.searchDate = '';
    }
  }
});

export const { setSearchName, setSearchDate, setShowInNavbar, setEvents, resetSearch } = searchSlice.actions;

// Thunk para filtrar eventos
export const filterEventsThunk = () => async (dispatch, getState) => {
    const { filterEvents } = await import('../api/EventEndpoints');
    const { searchName, searchDate } = getState().search;
    try {
        const data = await filterEvents(searchName, searchDate);
        dispatch(setEvents(data));
        return data;
    } catch (error) {
        console.error('Error filtrando eventos:', error);
        return [];
    }
};


export default searchSlice.reducer;