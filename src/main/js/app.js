'use strict';


const React = require('react');
const ReactDOM = require('react-dom');

const client = require('./client');
const follow = require('./follow'); // function to hop multiple links by "rel"

const root = '/api';

class App extends React.Component {

	constructor(props) {
		super(props);
		this.state = {notes: [], attributes: [], pageSize:2, links: {}};
		this.updatePageSize = this.updatePageSize.bind(this);
		this.onCreate = this.onCreate.bind(this);
		this.onDelete = this.onDelete.bind(this);
		this.onNavigate = this.onNavigate.bind(this);
	}

	loadFromServer(pageSize) {
		follow(client, root, [
			{rel: 'notes', params: {size: pageSize}}]
		).then(noteCollection => {
			return client({
				method: 'GET',
				path: noteCollection.entity._links.profile.href,
				headers: {'Accept': 'application/schema+json'}
			}).then(schema => {
				this.schema = schema.entity;
				return noteCollection;
			});
		}).done(noteCollection => {
			this.setState({
				notes: noteCollection.entity._embedded.notes,
				attributes: Object.keys(this.schema.properties),
				pageSize: pageSize,
				links: noteCollection.entity._links});
		});
	}

	// tag::create[]
	onCreate(newNote) {
		follow(client, root, ['notes']).then(noteCollection => {
			return client({
				method: 'POST',
				path: noteCollection.entity._links.self.href,
				entity: newNote,
				headers: {'Content-Type': 'application/json'}
			})
		}).then(response => {
			return follow(client, root, [
				{rel: 'notes', params: {'size': this.state.pageSize}}]);
		}).done(response => {
			this.onNavigate(response.entity._links.last.href);
		});
	}
	// end::create[]

	// tag::delete[]
	onDelete(note) {
		client({method: 'DELETE', path: note._links.self.href}).done(response => {
			this.loadFromServer(this.state.pageSize);
		});
	}
	// end::delete[]

	// tag::navigate[]
	onNavigate(navUri) {
		client({method: 'GET', path: navUri}).done(noteCollection => {
			this.setState({
				notes: noteCollection.entity._embedded.notes,
				attributes: this.state.attributes,
				pageSize: this.state.pageSize,
				links: noteCollection.entity._links
			});
		});
	}
	// end::navigate[]

	// tag::update-page-size[]
	updatePageSize(pageSize) {
		if (pageSize !== this.state.pageSize) {
			this.loadFromServer(pageSize);
		}
	}

	componentDidMount() {
		this.loadFromServer(this.state.pageSize);
	}

	render() {
		return (
			<div>
				<CreateDialog attributes={this.state.attributes} onCreate={this.onCreate}/>
				<NoteList notes={this.state.notes}
					links={this.state.links}
					pageSize={this.state.pageSize}
					onNavigate={this.onNavigate}
					onDelete={this.onDelete}
					updatePageSize={this.updatePageSize}/>
				</div>
		)
	}
}
// end::app[]

// tag::create-dialog[]
class CreateDialog extends React.Component {

	constructor(props) {
		super(props);
		this.handleSubmit = this.handleSubmit.bind(this);
	}

	handleSubmit(e) {
		console.log('je rentre dans le handleSubmit')
		e.preventDefault();
		var newNote = {};
		console.log('Avant la boucle');
		this.props.attributes.forEach(attribute => {
			newNote[attribute] = ReactDOM.findDOMNode(this.refs[attribute]).value.trim();
		});
		console.log('Avant appel onCreate');
		this.props.onCreate(newNote);

		// clear out the dialog's inputs
		this.props.attributes.forEach(attribute => {
			ReactDOM.findDOMNode(this.refs[attribute]).value = '';
		});

		// Navigate away from the dialog to hide it.
		window.location = "#";
	}

	render() {
		var inputs = this.props.attributes.map(attribute =>
			<p key={attribute}>
				<input type="text" placeholder={attribute} ref={attribute} className="field" />
			</p>
		);

		return (
			<div>
				<a href="#createNote">Create</a>

				<div id="createNote" className="modalDialog">
					<div>
						<a href="#" title="Close" className="close">X</a>

						<h2>Create new Note</h2>

						<form>
							{inputs}
							<button onClick={this.handleSubmit}>Create</button>
						</form>
					</div>
				</div>
			</div>
		)
	}

}
// end::create-dialog[]

// tag::note-list[]
class NoteList extends React.Component{

	constructor(props) {
		super(props);
		this.handleNavFirst = this.handleNavFirst.bind(this);
		this.handleNavPrev = this.handleNavPrev.bind(this);
		this.handleNavNext = this.handleNavNext.bind(this);
		this.handleNavLast = this.handleNavLast.bind(this);
		this.handleInput = this.handleInput.bind(this);
	}

	// tag::handle-page-size-updates[]
	handleInput(e) {
		e.preventDefault();
		var pageSize = ReactDOM.findDOMNode(this.refs.pageSize).value;
		if (/^[0-9]+$/.test(pageSize)) {
			this.props.updatePageSize(pageSize);
		} else {
			ReactDOM.findDOMNode(this.refs.pageSize).value =
				pageSize.substring(0, pageSize.length - 1);
		}
	}
	// end::handle-page-size-updates[]

	// tag::handle-nav[]
	handleNavFirst(e){
		e.preventDefault();
		this.props.onNavigate(this.props.links.first.href);
	}

	handleNavPrev(e) {
		e.preventDefault();
		this.props.onNavigate(this.props.links.prev.href);
	}

	handleNavNext(e) {
		e.preventDefault();
		this.props.onNavigate(this.props.links.next.href);
	}

	handleNavLast(e) {
		e.preventDefault();
		this.props.onNavigate(this.props.links.last.href);
	}

	render() {
		var notes = this.props.notes.map(note =>
			<Note key={note._links.self.href} note={note} onDelete={this.props.onDelete}/>
		);

		var navLinks = [];
		if ("first" in this.props.links) {
			navLinks.push(<button key="first" onClick={this.handleNavFirst}>&lt;&lt;</button>);
		}
		if ("prev" in this.props.links) {
			navLinks.push(<button key="prev" onClick={this.handleNavPrev}>&lt;</button>);
		}
		if ("next" in this.props.links) {
			navLinks.push(<button key="next" onClick={this.handleNavNext}>&gt;</button>);
		}
		if ("last" in this.props.links) {
			navLinks.push(<button key="last" onClick={this.handleNavLast}>&gt;&gt;</button>);
		}

		return (
			<div>
				<input ref="pageSize" defaultValue={this.props.pageSize} onInput={this.handleInput}/>
				<table>
					<tbody>
						<tr>
							<th>Title</th>
							<th>Description</th>
							<th></th>
						</tr>
						{notes}
					</tbody>
				</table>
				<div>
					{navLinks}
				</div>
			</div>
		)
	}
}
// end::note-list[]

// tag::note[]
class Note extends React.Component{

	constructor(props) {
		super(props);
		this.handleDelete = this.handleDelete.bind(this);
	}

	handleDelete() {
		this.props.onDelete(this.props.note);
	}

	render() {
		return (
			<tr>
				<td>{this.props.note.title}</td>
				<td>{this.props.note.description}</td>
				<td>
					<button onClick={this.handleDelete}>Delete</button>
				</td>
			</tr>
		)
	}
}
// end::note[]

// tag::render[]
ReactDOM.render(
	<App />,
	document.getElementById('react')
)
// end::render[]
