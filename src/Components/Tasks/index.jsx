import React, {useContext, useEffect, useState} from 'react';
import axios from 'axios';
import ReactPaginate from 'react-paginate';
import AuthContext, {DevContext} from '../Contexts';
import {Link} from 'react-router-dom';
import {Card, Col, Divider, Row, Spin, Tag} from "antd";
import useLocalStorage from "react-use-localstorage";

import htmlDecode from '../../utils/utils';
import css from './tasks.module.scss';

const Index = (props) => {
  const {developer} = useContext(DevContext);
  const {authState} = useContext(AuthContext);
  const [tasks, setTasks] = useState([]);
  const [pageCount, setPageCount] = useState(1);
  const [currentPage, setCurrentPage] = useLocalStorage('page');
  const [isOverlayActive, setOverlayActive] = useState(false);

  useEffect(() => {
    const loadTasks = async () => {
      let sort = ''
      if (props.sortField && props.sortDirection) {
        sort = `&sort_field=${props.sortField}&sort_direction=${props.sortDirection}`;
      }
      setOverlayActive(true);
      const loadedTasks = (await axios.get(`https://uxcandy.com/~shapoval/test-task-backend/v2/?developer=${developer}&page=${+currentPage + 1}${sort}`)).data;
      if (loadedTasks.status === 'ok') {
        setTasks(loadedTasks.message.tasks);
        setPageCount(Math.ceil(Number(loadedTasks.message.total_task_count) / 3));
      }
      setOverlayActive(false);
    };
    loadTasks();
  }, [currentPage, props.sortField, props.sortDirection, developer]);


  return (
    <div className={css.tasks}>
      <Spin
        size="large"
        spinning={isOverlayActive}
      >
        <Row gutter={16}>
          {
            tasks && tasks.map((task) => {
              const description = JSON.parse(htmlDecode(task.text));

              const statusTag = (task.status === 10) ? (<Tag color="geekblue">Выполнено</Tag>) :
                (task.status === 11) ? (<Tag color="gold">Задача отредактирована админом и выполнена</Tag>) :
                (task.status === 1) ? (<Tag color="volcano">Задача не выполнена, отредактирована админом</Tag>) :
                  <Tag>Задача не выполнена</Tag>

              return (
                <Col span={8} key={task.id}>
                  <Card title={`${task.username} / ${task.email}`}
                        extra={
                          authState.isAuthenticated &&
                          <Link
                            to={{pathname: `/task/${task.id}`, state: {task: task}}}
                          >Редактировать
                          </Link>
                        }
                  >
                    {statusTag}
                    <h4 className="card-title">{description.edited ? description.edited : description.original}</h4>
                  </Card>
                </Col>
              )
            })
          }
        </Row>
        <Divider/>
        {
          pageCount > 1 &&
          <ReactPaginate
            containerClassName={css.container}
            pageClassName={css.pageItem}
            breakClassName={css.disabled}
            activeClassName={css.activePag}
            disableInitialCallback={true}
            breakLabel={'...'}
            previousLabel={'Предыдущая'}
            nextLabel={'Следующая'}
            pageCount={pageCount}
            initialPage={+currentPage}
            marginPagesDisplayed={1}
            pageRangeDisplayed={2}
            onPageChange={(data) => {
              setCurrentPage((data.selected).toString())
            }
            }
          />
        }
      </Spin>
    </div>
  )
}

export default Index;