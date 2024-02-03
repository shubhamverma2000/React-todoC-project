import Search from "../components/Search"
import TasksList from "../components/Tasks"
const Todos = () => {
  return (
    <div className='todoPage'>
        <div className="todoCard">
            <Search />
            <TasksList/>
        </div>
    </div>
  )
}

export default Todos