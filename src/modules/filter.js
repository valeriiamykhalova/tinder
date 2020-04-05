import _ from 'lodash';

export default (profiles, user) => {
  const rejectMe = _.reject(profiles, (profile) => profile.id === user.id);

  const filterGender = _.filter(rejectMe, (profile) => {
    const userShowMen = user.showMen && profile.gender === 'male';
    const userShowWomen = user.showWomen && profile.gender === 'female';

    return userShowMen || userShowWomen;
  });

  return filterGender;
};
