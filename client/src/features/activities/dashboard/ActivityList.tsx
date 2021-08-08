import { observer } from 'mobx-react-lite';
import { Fragment } from 'react';
import { Header, Item, Segment } from 'semantic-ui-react';

import { useStore } from '../../../app/stores/store';
import ActivityListItem from './ActivityListItem';

function ActivityList() {

    const { activityStore } = useStore();
    const { groupedActivites } = activityStore;

    return (
        <>
            {groupedActivites.map(([ date, activities ]) => (
                <Fragment key={date}>
                    <Header sub color='teal'>
                        {date}
                    </Header>
                    <Segment>
                        <Item.Group divided>
                            {activities.map((activity) => (
                                <ActivityListItem key={activity.id} activity={activity}/>
                            ))}
                        </Item.Group>
                    </Segment>
                </Fragment>
            ))}
        </>
    );
}

export default observer(ActivityList);