/* eslint-disable react/state-in-constructor */
/* eslint-disable react/static-property-placement */
import React, {Component} from 'react';
import {ActivityIndicator} from 'react-native';
import PropTypes from 'prop-types';

import api from '../../services/api';

import {
  Container,
  Header,
  Avatar,
  Name,
  Bio,
  Stars,
  Starred,
  OwnerAvatar,
  Info,
  Title,
  Author,
  Loading,
} from './styles';

export default class User extends Component {
  static navigationOptions = ({navigation}) => ({
    title: navigation.getParam('user').name,
  });

  static propTypes = {
    navigation: PropTypes.shape({
      getParam: PropTypes.func,
      navigate: PropTypes.func,
    }).isRequired,
  };

  state = {
    stars: [],
    loading: false,
    page: null,
    refreshing: false,
  };

  async componentDidMount() {
    const {navigation} = this.props;
    const user = navigation.getParam('user');

    this.setState({
      loading: true,
    });

    const response = await api.get(`/users/${user.login}/starred`);

    this.setState({
      stars: response.data,
    });

    this.setState({
      loading: false,
      page: 1,
    });
  }

  loadMore = async () => {
    const {navigation} = this.props;
    const user = navigation.getParam('user');
    const {stars, page} = this.state;
    const nextpage = page + 1;

    const response = await api.get(
      `/users/${user.login}/starred?page=${nextpage}`
    );

    this.setState({
      stars: [...stars, ...response.data],
      page: nextpage,
    });
  };

  refreshList = async () => {
    const {navigation} = this.props;
    const user = navigation.getParam('user');

    const firstPage = await this.setState({
      page: 1,
      refreshing: true,
    });

    const response = await api.get(
      `/users/${user.login}/starred?page=${firstPage}`
    );

    this.setState({
      stars: response.data,
      refreshing: false,
    });
  };

  handleNavigate = repository => {
    const {navigation} = this.props;
    navigation.navigate('Repository', {repository});
  };

  render() {
    const {stars, loading, refreshing} = this.state;
    const {navigation} = this.props;

    const user = navigation.getParam('user');

    return (
      <Container>
        <Header>
          <Avatar source={{uri: user.avatar}} />
          <Name>{user.name}</Name>
          <Bio>{user.bio}</Bio>
        </Header>

        {loading ? (
          <Loading>
            <ActivityIndicator color="#333" size="large" />
          </Loading>
        ) : (
          <Stars
            data={stars}
            onRefresh={this.refreshList}
            refreshing={refreshing}
            onEndReachedThreshold={0.2}
            onEndReached={this.loadMore}
            keyExtractor={star => String(star.id)}
            renderItem={({item}) => (
              <Starred onPress={() => this.handleNavigate(item)}>
                <OwnerAvatar source={{uri: item.owner.avatar_url}} />
                <Info>
                  <Title>{item.name}</Title>
                  <Author>{item.owner.login}</Author>
                </Info>
              </Starred>
            )}
          />
        )}
      </Container>
    );
  }
}
