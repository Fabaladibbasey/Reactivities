import { observer } from "mobx-react-lite";
import { useEffect } from "react";
import { useParams } from "react-router-dom";
import { Grid } from "semantic-ui-react";
import { useStore } from "../../app/api/stores/store";
import LoadingComponent from "../../app/layout/LoadingComponent";
import ProfileContent from "./ProfileContent";
import ProfileHeader from "./ProfileHeader";

function ProfilePage() {
  const { userName } = useParams<{ userName: string }>();
  const { loadingProfile, profile, loadProfile } = useStore().profileStore;

  useEffect(() => {
    if (userName) loadProfile(userName);
  }, [loadProfile, userName]);

  if (loadingProfile) return <LoadingComponent content="Loading profile..." />;
  return (
    <Grid>
      <Grid.Column width={16}>
        {profile && (
          <>
            <ProfileHeader profile={profile} />

            <ProfileContent profile={profile!} />
          </>
        )}
      </Grid.Column>
    </Grid>
  );
}

export default observer(ProfilePage);
