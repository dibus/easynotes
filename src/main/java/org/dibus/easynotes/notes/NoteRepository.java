package org.dibus.easynotes.notes;

import java.util.List;

import org.springframework.data.repository.PagingAndSortingRepository;

public interface NoteRepository extends PagingAndSortingRepository<Note, Long> {

    List<Note> findByTitle(String title);
}
