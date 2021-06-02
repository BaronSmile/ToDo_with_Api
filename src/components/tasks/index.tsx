import React, {useContext, useEffect, useState} from 'react';
import axios from 'axios';
import {Card, Col, Divider, Row, Spin, Tag} from "antd";
import {Link} from 'react-router-dom';
import ReactPaginate from 'react-paginate';

import AuthContext, {DevContext} from "../context";
import {htmlDecode} from "../../utils";
import css from './tasks.module.scss';

interface Props {
  sortField: undefined | string
  sortDirection: undefined | string
}

const Tasks = ({sortField, sortDirection}: Props) => {
    const {developer} = useContext(DevContext) as any;
    const {authState} = useContext(AuthContext) as any;
    const [tasks, setTasks] = useState([]);
    const [pageCount, setPageCount] = useState(1);
    const [currentPage, setCurrentPage] = useState(0);
    const [isOverlayActive, setOverlayActive] = useState(false);

    useEffect(() => {
      const loadTasks = async () => {
        let sort = ''
        if (sortField && sortDirection) {
          sort = `&sort_field=${sortField}&sort_direction=${sortDirection}`;
        }
        setOverlayActive(true);
        const loadedTasks = (await axios.get(`https://uxcandy.com/~shapoval/test-task-backend/v2/?developer=${developer}&page=${currentPage + 1}${sort}`)).data;
        if (loadedTasks.status === 'ok') {
          setTasks(loadedTasks.message.tasks);
          setPageCount(Math.ceil(Number(loadedTasks.message.total_task_count) / 3));
        }
        setOverlayActive(false);
      };
      loadTasks();
    }, [currentPage, sortField, sortDirection, developer]);

    return (
      <div className={css.tasks}>
        <Spin
          className={css.spin}
          size="large"
          spinning={isOverlayActive}
        >
          <Row gutter={16}>
            {
              tasks && tasks.map((task: {
                text: string;
                id: React.Key | null | undefined;
                username: string | number | boolean | {} | React.ReactElement<any, string | React.JSXElementConstructor<any>> | React.ReactNodeArray | React.ReactPortal | null | undefined;
                email: string | number | boolean | {} | React.ReactElement<any, string | React.JSXElementConstructor<any>> | React.ReactNodeArray | React.ReactPortal | null | undefined;
                status: number;
              }) => {
                const description = JSON.parse(htmlDecode(task.text) as string);

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
                      {
                        task.status === 10 &&
                        <Tag color="geekblue">Выполнено</Tag>
                      }
                      {
                        description.edited &&
                        <Tag color="blue">Отредактировано</Tag>
                      }
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
              breakLabel={'...'}
              previousLabel={'Предыдущая'}
              nextLabel={'Следующая'}
              pageCount={pageCount}
              marginPagesDisplayed={1}
              pageRangeDisplayed={2}
              onPageChange={(data) => {
                setCurrentPage(data.selected)
              }
              }
            />
          }
        </Spin>
      </div>
    );
  }
;

export default Tasks;
