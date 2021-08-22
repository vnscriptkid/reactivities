import { useEffect, useState } from 'react';
import { observer } from 'mobx-react-lite';
import { Grid, Loader } from 'semantic-ui-react';

import { useStore } from '../../../app/stores/store';
import ActivityList from './ActivityList';
import ActivityFilters from './ActivityFilters';
import { PaginationParams } from '../../../app/models/Pagination';
import InfiniteScroll from 'react-infinite-scroller';
import ActivityListItemPlaceholder from './ActivityListItemPlaceholder';

function ActivityDashboard() {

    const { activityStore  } = useStore();
    const { loadActivities, activityRegistry, pagination, setPaginationParams } = activityStore;
    const [loadingMore, setLoadingMore] = useState(false);
    
    useEffect(() => { 
        if (activityRegistry.size < 2) {
            loadActivities();
        }
    }, [loadActivities, activityRegistry]);

    function handleLoadMore() {
        setLoadingMore(true);
        setPaginationParams(new PaginationParams(pagination!.currentPage + 1));
        loadActivities().then(() => setLoadingMore(false));
    }
  
    // if (activityStore.initialLoading && !loadingMore) return <Loading />

    return (
        <Grid>
            <Grid.Column width={10}>
                {activityStore.initialLoading && !loadingMore ? (
                    <>
                        <ActivityListItemPlaceholder />
                        <ActivityListItemPlaceholder />
                    </>
                ) : (
                    <InfiniteScroll 
                        pageStart={0}
                        loadMore={handleLoadMore}
                        hasMore={!loadingMore && !!pagination && pagination.currentPage < pagination.totalPages}
                        initialLoad={false}
                    >
                        <ActivityList />
                    </InfiniteScroll>
                )}
            </Grid.Column>
            <Grid.Column width={6}>
                <ActivityFilters />
            </Grid.Column>
            <Grid.Column width={10}>
                <Loader active={loadingMore} />
            </Grid.Column>
        </Grid>
    );
}

export default observer(ActivityDashboard);