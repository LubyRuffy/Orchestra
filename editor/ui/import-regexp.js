
//
// Copyright 2016 Kary Foundation, Inc.
//   Author: Pouya Kary <k@karyfoundation.org>
//
// This Source Code Form is subject to the terms of the Mozilla Public
// License, v. 2.0. If a copy of the MPL was not distributed with this
// file, You can obtain one at http://mozilla.org/MPL/2.0/.
//

//
// ─── MAKE HIDDEN EFFECT ─────────────────────────────────────────────────────────
//

    function checkToSeeIfRegExpImporterNeedsToBeDisabledOnOutClick ( event ) {
        function isChildOf( child, parent ) {
            if ( child.parentNode === parent ) {
                return true;
            } else if ( child.parentNode === null ) {
                return false;
            } else {
                return isChildOf( child.parentNode, parent );
            }
        }

        let dialog = document.getElementById('regexp-importer')
        if ( !( event.target === document.getElementById('import-regexp-ribbon-button' ) ||
                isChildOf( event.target, dialog ) ) ) {
            dialog.hidden = true
        }
    }

//
// ─── REGEX IMPORTER KEYPRESS ────────────────────────────────────────────────────
//

    function onRegExImporterOnKeypress ( event ) {
        if ( event.keyCode === 13 )
            onImportRegExp( )
        onCheckRegExpForImporter( )
    }

//
// ─── EXPORTER ───────────────────────────────────────────────────────────────────
//

    function onOpenOrCloseImportRegExpDialog ( ) {
        let dialog = document.getElementById('regexp-importer')
        dialog.hidden = !dialog.hidden

        if ( !dialog.hidden )
            document.onclick = checkToSeeIfRegExpImporterNeedsToBeDisabledOnOutClick
        else
            document.onclick = null

        document.getElementById('regexp-importer-input').value = ''
        onCheckRegExpForImporter( )
    }

//
// ─── ON IMPORT REGEXP ───────────────────────────────────────────────────────────
//

    function onImportRegExp ( ) {
        let input = document.getElementById('regexp-importer-input').value
        let quartetXML = compileRegExToQuartetXML( input )
        updateWorkspaceWithNewXML( quartetXML )
        setFileDirty( true )
        onOpenOrCloseImportRegExpDialog( )
    }

//
// ─── ON CHECK REGEXP ────────────────────────────────────────────────────────────
//

    function onCheckRegExpForImporter ( ) {
        let wildcard = document.getElementById('regexp-importer-input').value
        try {
            if ( wildcard === '' )
                return setRegExpImportButtonStatus( false )
            new RegExp( wildcard )
            return setRegExpImportButtonStatus( true )
        } catch ( error ) {
            return setRegExpImportButtonStatus( false )
        }
    }

    function setRegExpImportButtonStatus ( enable ) {
        let button  = document.getElementById('regexp-importer-button')
        let input   = document.getElementById('regexp-importer-input')
        if ( enable ) {
            input.className     = 'input-with-button'
            button.className    = 'enabled-button'
            return true
        } else {
            input.className     = 'full-input'
            button.className    = 'disabled-button'
            return false
        }
    }

//
// ─── COMPILER ───────────────────────────────────────────────────────────────────
//

    function compileRegExToQuartetXML ( regX ) {
        try {
            let regulexAST = regulex.parse( regX )
            let compiledXML = concerto.compile( regulexAST )
            return compiledXML.replace( /\\"/g, '"' )
        } catch ( error ) {
            throw error
        }
    }

// ────────────────────────────────────────────────────────────────────────────────
