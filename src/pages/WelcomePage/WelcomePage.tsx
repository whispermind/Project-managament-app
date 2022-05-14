import { Avatar, Popover } from 'antd';
import { Typography } from 'antd';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import OurTeam, { getMemberGitHubLink, TeamMember } from '../../enumerations/OurTeam';

const { Title, Link, Text } = Typography;

function WelcomePage() {
  const { t } = useTranslation();

  function getAvatar(member: TeamMember) {
    const gitHubLink = getMemberGitHubLink(member.gitHubProfile);
    return (
      <Popover
        key={member.name}
        content={
          <Link href={gitHubLink} target="_blank">
            {member.name}
          </Link>
        }>
        <Avatar size={64} src={gitHubLink + '.png'} />
      </Popover>
    );
  }

  return (
    <Container>
      <StyledTitle>{t('application-title')}</StyledTitle>
      <StyledText italic>{t('description1')}</StyledText>
      <StyledTitle level={2}>{t('our-team')}</StyledTitle>
      <AvatarsBlock>{OurTeam.map(getAvatar)}</AvatarsBlock>
      <StyledText>
        {t('description2.start-text')}
        <Link href="https://rs.school/react/" target="_blank">
          {t('description2.course-link')}
        </Link>
        {t('description2.middle-text')}
        <Link href="https://rs.school/index.html" target="_blank">
          {t('description2.school-link')}
        </Link>
      </StyledText>
    </Container>
  );
}

const Container = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  padding: 5rem;
`;

const AvatarsBlock = styled.div`
  display: flex;
  gap: 1.5rem;
  margin-bottom: 1rem;
`;

const StyledText = styled(Text)`
  text-align: center;
`;

const StyledTitle = styled(Title)`
  text-align: center;
`;

export default WelcomePage;
