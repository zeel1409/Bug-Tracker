import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import { useProject } from '../../context/ProjectContext';
import { priorityBadge, typeBadge, getInitials } from '../../utils/helpers';
import { MessageSquare } from 'lucide-react';
import toast from 'react-hot-toast';

const COLUMNS = [
  { id: 'todo', label: 'To Do', color: '#64748b' },
  { id: 'inprogress', label: 'In Progress', color: '#eab308' },
  { id: 'done', label: 'Done', color: '#22c55e' }
];

export default function KanbanBoard({ tickets, onTicketClick }) {
  const { updateTicket, setTickets } = useProject();

  const grouped = {
    todo: tickets.filter(t => t.status === 'todo'),
    inprogress: tickets.filter(t => t.status === 'inprogress'),
    done: tickets.filter(t => t.status === 'done')
  };

  const onDragEnd = async (result) => {
    const { destination, source, draggableId } = result;

    if (!destination) return;
    if (destination.droppableId === source.droppableId && destination.index === source.index) return;

    const newStatus = destination.droppableId;

    // Optimistically update local state
    setTickets(prev => prev.map(t => t._id === draggableId ? { ...t, status: newStatus } : t));

    try {
      await updateTicket(draggableId, { status: newStatus });
    } catch {
      toast.error('Failed to update status');
      // revert
      setTickets(prev => prev.map(t => t._id === draggableId ? { ...t, status: source.droppableId } : t));
    }
  };

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <div className="flex gap-4 overflow-x-auto pb-4">
        {COLUMNS.map(col => (
          <div key={col.id} className="kanban-col">
            <div className="kanban-col-header">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full" style={{ background: col.color }} />
                <span className="text-sm font-semibold" style={{color:'#1e293b'}}>{col.label}</span>
                <span className="text-xs ml-1" style={{color:'#94a3b8'}}>
                  {grouped[col.id]?.length || 0}
                </span>
              </div>
            </div>

            <Droppable droppableId={col.id}>
              {(provided, snapshot) => (
                <div
                  className="kanban-col-body"
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                  style={{
                    background: snapshot.isDraggingOver ? '#eef2ff' : undefined,
                    transition: 'background 0.15s',
                    minHeight: 80
                  }}>
                  {grouped[col.id]?.map((ticket, index) => (
                    <Draggable key={ticket._id} draggableId={ticket._id} index={index}>
                      {(provided, snapshot) => (
                        <div
                          className="ticket-card"
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          style={{
                            ...provided.draggableProps.style,
                            opacity: snapshot.isDragging ? 0.9 : 1,
                            boxShadow: snapshot.isDragging ? '0 8px 24px rgba(88,101,242,0.2)' : undefined
                          }}
                          onClick={() => onTicketClick(ticket)}>
                          {/* type + priority badges */}
                          <div className="flex items-center gap-1 mb-2 flex-wrap">
                            <span className={typeBadge(ticket.type)}>{ticket.type}</span>
                            <span className={priorityBadge(ticket.priority)}>{ticket.priority}</span>
                          </div>

                          <p className="text-xs font-medium leading-snug mb-2" style={{color:'#1e293b'}}>{ticket.title}</p>

                          {/* footer */}
                          <div className="flex items-center justify-between">
                            <span className="text-[10px]" style={{color:'#94a3b8'}}>
                              #{ticket.ticketNumber}
                            </span>
                            <div className="flex items-center gap-2">
                              {ticket.assignee && (
                                <div className="w-5 h-5 rounded-full bg-[#5865f2] flex items-center justify-center text-[9px] font-bold text-white"
                                  title={ticket.assignee.name}>
                                  {getInitials(ticket.assignee.name)}
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </div>
        ))}
      </div>
    </DragDropContext>
  );
}
