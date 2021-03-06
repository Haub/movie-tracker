import React from 'react';
import { shallow } from 'enzyme';

import { removeFavorite, addFavorite } from '../../actions';
import { Card, mapStateToProps, mapDispatchToProps } from '.';

describe('Card component', () => {
  let mockHistory;
  let mockMovie;
  let mockUser;
  let wrapper;
  let mockRemoveFavorite;
  let mockAddFavorite;
  let mockFn;
  let e;

  beforeEach(() => {
    window.fetch = jest.fn().mockImplementation(() => {
      return Promise.resolve({ json:() => Promise.resolve({})});
    });
    mockRemoveFavorite = jest.fn();
    mockAddFavorite = jest.fn();
    mockFn = jest.fn();
    e = {stopPropagation:jest.fn()};
    mockMovie = {
      title: 'title', 
      poster_path: 'words.jpg', 
      vote_average: 'avg', 
      overview: 'overview', 
      release_date: 'release',
      movie_id: 35
    };
    mockUser = { id: 1, name:'tim' };
    mockHistory = { push: jest.fn().mockImplementation(() => {}) };
  });

  it('should match snapshot with props passed', () => {
    wrapper = shallow(
      <Card 
        movie={mockMovie}
        history={mockHistory} 
        key={mockMovie.title+1}  
      />);
    expect(wrapper).toMatchSnapshot();
  });

  it('should have default state of toggleinfo and favorite set to false', () => {
    wrapper = shallow(
      <Card 
        movie={mockMovie}
        history={mockHistory} 
        key={mockMovie.title+1}  
      />);
    expect(wrapper.state().toggleInfo).toEqual(false);
    expect(wrapper.state().favorite).toEqual(false);
  });

  it('should toggle favorite to true on mount if matching a favorite movie', async () => {
    wrapper = shallow(
      <Card 
        movie={mockMovie}
        favorites={[mockMovie]}
        history={mockHistory} 
        key={mockMovie.title+1}  
      />);
    wrapper.instance().componentDidMount();
    expect(wrapper.state().favorite).toEqual(true);
  });

  it('should not toggle favorite to true on mount if matching a favorite movie', async () => {
    wrapper = shallow(
      <Card 
        movie={mockMovie}
        favorites={[]}
        history={mockHistory} 
        key={mockMovie.title+1}  
      />);
    wrapper.instance().componentDidMount();
    expect(wrapper.state().favorite).toEqual(false);
  });

  it('should switch toggleinfo to true on click', () => {
    wrapper = shallow(
      <Card 
        movie={mockMovie}
        history={mockHistory} 
        key={mockMovie.title+1}  
      />);
    wrapper.find('article').simulate('click');
    expect(wrapper.state().toggleInfo).toEqual(true);
  });

  it('toggleinfo should change from hide to show', () => {
    wrapper = shallow(
      <Card 
        movie={mockMovie}
        history={mockHistory} 
        key={mockMovie.title+1}  
      />);

    expect(wrapper.find('article').hasClass('hide')).toEqual(true);
    expect(wrapper.find('article').hasClass('show')).toEqual(false);
    wrapper.instance().toggleInfo();
    expect(wrapper.find('article').hasClass('hide')).toEqual(false);
    expect(wrapper.find('article').hasClass('show')).toEqual(true);
  });

  it('should match snapshot after toggling favorite', () => {
    wrapper = shallow(
      <Card 
        favorites={[mockMovie]}
        user={mockUser}
        removeFavoriteFromStore={mockFn}
        addFavoriteToStore={mockFn}
        movie={mockMovie}
        history={mockHistory} 
        key={mockMovie.title+1}  
      />);
    wrapper.find('button').simulate('click', e);
    expect(wrapper).toMatchSnapshot();
  });

  it('should call addFavoriteToStore if not matching favorite in store', () => {
    wrapper = shallow(
      <Card 
        favorites={[{}]}
        user={mockUser}
        removeFavoriteFromStore={mockFn}
        addFavoriteToStore={mockAddFavorite}
        movie={mockMovie}
        history={mockHistory} 
        key={mockMovie.title+1}  
      />);
    wrapper.find('button').simulate('click', e);
    expect(mockAddFavorite).toHaveBeenCalled();
  });

  it('should call removeFavoriteFromStore if matching favorite in store', () => {
    wrapper = shallow(
      <Card 
        favorites={[mockMovie]}
        user={mockUser}
        removeFavoriteFromStore={mockRemoveFavorite}
        addFavoriteToStore={mockFn}
        movie={mockMovie}
        history={mockHistory} 
        key={mockMovie.title+1}  
      />);
    wrapper.find('button').simulate('click', e);
    expect(mockRemoveFavorite).toHaveBeenCalled();
  });

  it('should switch favorite state if toggleFavorite is called', () => {
    wrapper = shallow(
      <Card 
        favorites={[mockMovie]}
        user={mockUser}
        removeFavoriteFromStore={mockRemoveFavorite}
        addFavoriteToStore={mockFn}
        movie={mockMovie}
        history={mockHistory} 
        key={mockMovie.title+1}  
      />);
    expect(wrapper.state().favorite).toEqual(false);
    wrapper.find('button').simulate('click', e);
    expect(wrapper.state().favorite).toEqual(true);
  });

  it('should push /signup to history if user does not exist', () => {
    mockUser = { name: undefined };
    mockHistory = { push: jest.fn().mockImplementation(() => ({location:'/signup'}))};
    wrapper = shallow(
      <Card 
        favorites={[mockMovie]}
        user={mockUser}
        removeFavoriteFromStore={mockRemoveFavorite}
        addFavoriteToStore={mockFn}
        movie={mockMovie}
        history={mockHistory} 
        key={mockMovie.title+1}  
      />);
    wrapper.find('button').simulate('click', e);
    expect(mockHistory.push).toHaveBeenCalled();
  });

  describe('mapStateToProps', () => {
    it('should have access to user and user\'s favorites array', () => {
      const name = 'Tim';
      const id = 2;
      const email = 'foo@barr';
      const password = 'oops';
      const mockStore = {
        user: {name, id, email, password},
        favorites: []
      };
      const expected = {...mockStore};
      const result = mapStateToProps(mockStore);
      expect(result).toEqual(expected);
    });
  });

  describe('mapDispatchToProps', () => {
    it('should remove movie from user\'s favorites', () => {
      const mockDispatch = jest.fn();
      const actionToDispatch = removeFavorite({});
      const mappedProps = mapDispatchToProps(mockDispatch);
      mappedProps.removeFavoriteFromStore({});
      expect(mockDispatch).toHaveBeenCalledWith(actionToDispatch);
    });

    it('should add favorite movie to user\'s favorites', () => {
      const mockDispatch = jest.fn();
      const actionToDispatch = addFavorite({});
      const mappedProps = mapDispatchToProps(mockDispatch);
      mappedProps.addFavoriteToStore({});
      expect(mockDispatch).toHaveBeenCalledWith(actionToDispatch);
    });
  });
});