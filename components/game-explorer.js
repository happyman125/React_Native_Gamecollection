import React from 'react';
import styled from 'styled-components/native';

import Background from './background'
import SearchEngine from './search-engine'
import GameList from './game-list'

export default class GameExplorerComponent extends React.Component {
  constructor(props) {
    super(props)
  }

  render() {
    return (
      <GameExplorer>
        <GameList
          {...this.props}
        />
        <SearchEngine
          {...this.props}
        />
      </GameExplorer>
    )
  }
}

const GameExplorer = styled.View`
  flex: 1;
  padding-top: 20;
  padding-Bottom: 20;
  padding-left: 0;
  padding-right: 0;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  background-color: transparent;
`;
