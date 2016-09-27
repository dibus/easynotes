'use strict';

// tag::vars[]
//import ReactDOM from 'react-dom';
//import React from 'react';

const ReactDOM = require('react-dom');
const React = require('react')

const client = require('./client');
// end::vars[]

// tag::app[]
class App extends React.Component {

	constructor(props) {
		super(props);
		this.state = {notes: []};
	}

	componentDidMount() {
		client({method: 'GET', path: '/api/notes'}).done(response => {
			this.setState({notes: response.entity._embedded.notes});
		});
	}

	render() {
		return (
			<NoteList notes={this.state.notes}/>
		)
	}
}
// end::app[]

// tag::note-list[]
class NoteList extends React.Component{
	render() {
		var notes = this.props.notes.map(note =>
			<Note key={note._links.self.href} note={note}/>
		);
		return (
			<table>
				<tbody>
					<tr>
						<th>Title</th>
						<th>Description</th>
					</tr>
					{notes}
				</tbody>
			</table>
		)
	}
}
// end::note-list[]

// tag::note[]
class Note extends React.Component{
	render() {
		return (
			<tr>
				<td>{this.props.note.title}</td>
				<td>{this.props.note.description}</td>
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
