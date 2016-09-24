package org.dibus.easynotes.notes;

import java.util.List;

import org.springframework.data.repository.CrudRepository;

public interface NoteRepository extends CrudRepository<Note, Long> {

    List<Note> findByTitle(String title);
}
